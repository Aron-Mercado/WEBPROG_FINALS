<?php
// backend/controllers/OrderController.php

require_once __DIR__ . '/../models/OrderModel.php';
require_once __DIR__ . '/../models/ProductModel.php';
require_once __DIR__ . '/../config/auth.php';

class OrderController {
    private $orderModel;
    private $productModel;

    public function __construct() {
        $this->orderModel = new OrderModel();
        $this->productModel = new ProductModel();
    }

    public function list($user = null) {
        header('Content-Type: application/json');
        if ($user && $user['role'] === 'manager') {
            $orders = $this->orderModel->getOrders();
        } elseif ($user) {
            $orders = $this->orderModel->getOrders($user['id']);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Authentication required']);
            return;
        }

        foreach ($orders as &$order) {
            $order['items'] = $this->orderModel->getOrderItems($order['id']);
        }

        echo json_encode($orders);
    }

    public function create($user) {
        $user = Auth::requireUser();
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['items']) || !is_array($data['items']) || count($data['items']) === 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Order must contain at least one item']);
            return;
        }

        $totalPrice = 0.0;
        $items = [];

        foreach ($data['items'] as $item) {
            if (!isset($item['product_id'], $item['quantity'])) {
                continue;
            }
            $productId = intval($item['product_id']);
            $quantity = intval($item['quantity']);
            if ($quantity <= 0) {
                continue;
            }

            $product = $this->productModel->getProductById($productId);
            if (!$product) {
                http_response_code(400);
                echo json_encode(['error' => "Product id {$productId} not found"]);
                return;
            }

            if ($product['stock'] < $quantity) {
                http_response_code(400);
                echo json_encode(['error' => "Not enough stock for {$product['name']}"]);
                return;
            }

            $items[] = [
                'product' => $product,
                'quantity' => $quantity,
                'subtotal' => $product['price'] * $quantity,
            ];
            $totalPrice += $product['price'] * $quantity;
        }

        if (count($items) === 0) {
            http_response_code(400);
            echo json_encode(['error' => 'No valid items to order']);
            return;
        }

        try {
            $this->orderModel->beginTransaction();
            $orderId = $this->orderModel->createOrder($totalPrice, $user['id']);

            foreach ($items as $entry) {
                $product = $entry['product'];
                $quantity = $entry['quantity'];
                $this->orderModel->createOrderItem($orderId, $product['id'], $quantity, $product['price']);
                $success = $this->productModel->reduceStock($product['id'], $quantity);
                if (!$success) {
                    throw new Exception('Stock update failed for product id ' . $product['id']);
                }
            }

            $this->orderModel->commit();
            echo json_encode(['success' => true, 'order_id' => $orderId, 'total_price' => $totalPrice]);
        } catch (Exception $e) {
            $this->orderModel->rollBack();
            require_once __DIR__ . '/../config/http.php';
            $payload = ['error' => 'Unable to create order'];
            if (isAppDebug()) {
                $payload['message'] = $e->getMessage();
            }
            sendJson($payload, 500);
        }
    }

    public function updateStatus($id) {
        $user = Auth::requireManager();
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['status'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Status is required']);
            return;
        }

        $allowed = ['Pending', 'Processing', 'Completed', 'Cancelled'];
        $status = trim($data['status']);
        if (!in_array($status, $allowed, true)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid status value']);
            return;
        }

        $this->orderModel->updateOrderStatus($id, $status);
        echo json_encode(['success' => true]);
    }
}
