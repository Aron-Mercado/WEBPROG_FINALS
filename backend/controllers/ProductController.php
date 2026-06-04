<?php
// backend/controllers/ProductController.php

require_once __DIR__ . '/../models/ProductModel.php';
require_once __DIR__ . '/../config/auth.php';

class ProductController {
    private $model;

    public function __construct() {
        $this->model = new ProductModel();
    }

    public function list($includeArchived = false) {
        header('Content-Type: application/json');
        echo json_encode($this->model->getAllProducts($includeArchived));
    }

    public function update($id) {
        $user = Auth::requireManager();

        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['name'], $data['price'], $data['stock'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid payload: name, price, stock required']);
            return;
        }

        $name = trim($data['name']);
        $price = floatval($data['price']);
        $stock = intval($data['stock']);
        $archived = isset($data['archived']) ? (intval($data['archived']) ? 1 : 0) : 0;

        if ($name === '' || $price < 0 || $stock < 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid product values']);
            return;
        }

        $product = $this->model->getProductById($id);
        if (!$product) {
            http_response_code(404);
            echo json_encode(['error' => 'Product not found']);
            return;
        }

        $this->model->updateProduct($id, $name, $price, $stock, $archived);
        echo json_encode(['success' => true, 'product' => $this->model->getProductById($id)]);
    }

    public function create() {
        $user = Auth::requireManager();

        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['name'], $data['price'], $data['stock'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid payload: name, price, stock required']);
            return;
        }

        $name = trim($data['name']);
        $price = floatval($data['price']);
        $stock = intval($data['stock']);
        $archived = isset($data['archived']) ? (intval($data['archived']) ? 1 : 0) : 0;

        if ($name === '' || $price < 0 || $stock < 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid product values']);
            return;
        }

        $id = $this->model->createProduct($name, $price, $stock, $archived);
        http_response_code(201);
        echo json_encode(['success' => true, 'id' => $id]);
    }

    public function delete($id) {
        $user = Auth::requireManager();

        $product = $this->model->getProductById($id);
        if (!$product) {
            http_response_code(404);
            echo json_encode(['error' => 'Product not found']);
            return;
        }

        $this->model->deleteProduct($id);
        echo json_encode(['success' => true]);
    }
}
