<?php
// backend/models/UserModel.php

require_once __DIR__ . '/../config/database.php';

class UserModel {
    private $db;

    public function __construct() {
        $this->db = Database::connect();
    }

    public function createUser($username, $passwordHash, $role = 'customer', $apiToken = null) {
        $stmt = $this->db->prepare('INSERT INTO users (username, password, role, api_token, created_at) VALUES (?, ?, ?, ?, NOW())');
        $stmt->execute([$username, $passwordHash, $role, $apiToken]);
        return $this->db->lastInsertId();
    }

    public function getByUsername($username) {
        $stmt = $this->db->prepare('SELECT id, username, password, role, api_token FROM users WHERE username = ?');
        $stmt->execute([$username]);
        return $stmt->fetch();
    }

    public function getByToken($token) {
        if (!$token) {
            return null;
        }
        $stmt = $this->db->prepare('SELECT id, username, role, api_token FROM users WHERE api_token = ?');
        $stmt->execute([$token]);
        return $stmt->fetch();
    }

    public function getById($id) {
        $stmt = $this->db->prepare('SELECT id, username, role, api_token FROM users WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function updateToken($id, $token) {
        $stmt = $this->db->prepare('UPDATE users SET api_token = ? WHERE id = ?');
        return $stmt->execute([$token, $id]);
    }
}
