<?php
// backend/models/OrderModel.php

require_once __DIR__ . '/../config/database.php';

class OrderModel {
    private $db;

    public function __construct() {
        $this->db = Database::connect();
    }

    public function createOrder($totalPrice, $userId = null) {
        $stmt = $this->db->prepare('INSERT INTO orders (user_id, total_price, status, created_at) VALUES (?, ?, ?, NOW())');
        $stmt->execute([$userId, $totalPrice, 'Pending']);
        return $this->db->lastInsertId();
    }

    public function createOrderItem($orderId, $productId, $quantity, $price) {
        $stmt = $this->db->prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');
        return $stmt->execute([$orderId, $productId, $quantity, $price]);
    }

    public function getOrderById($orderId) {
        $stmt = $this->db->prepare('SELECT o.*, u.username FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE o.id = ?');
        $stmt->execute([$orderId]);
        return $stmt->fetch();
    }

    public function getOrderItems($orderId) {
        $stmt = $this->db->prepare('SELECT oi.id, oi.product_id, oi.quantity, oi.price, p.name FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?');
        $stmt->execute([$orderId]);
        return $stmt->fetchAll();
    }

    public function getOrders($userId = null) {
        if ($userId !== null) {
            $stmt = $this->db->prepare('SELECT o.*, u.username FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE o.user_id = ? ORDER BY o.id DESC');
            $stmt->execute([$userId]);
        } else {
            $stmt = $this->db->query('SELECT o.*, u.username FROM orders o LEFT JOIN users u ON o.user_id = u.id ORDER BY o.id DESC');
        }
        return $stmt->fetchAll();
    }

    public function updateOrderStatus($orderId, $status) {
        $stmt = $this->db->prepare('UPDATE orders SET status = ? WHERE id = ?');
        return $stmt->execute([$status, $orderId]);
    }

    public function beginTransaction() {
        return $this->db->beginTransaction();
    }

    public function commit() {
        return $this->db->commit();
    }

    public function rollBack() {
        return $this->db->rollBack();
    }
}
