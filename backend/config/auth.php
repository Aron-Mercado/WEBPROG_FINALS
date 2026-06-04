<?php
// backend/config/auth.php

require_once __DIR__ . '/http.php';

class Auth {
    public static function getBearerToken() {
        $headers = [];
        if (function_exists('apache_request_headers')) {
            $headers = apache_request_headers();
        }

        if (isset($headers['Authorization'])) {
            $header = $headers['Authorization'];
        } elseif (isset($headers['authorization'])) {
            $header = $headers['authorization'];
        } elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $header = $_SERVER['HTTP_AUTHORIZATION'];
        } else {
            return null;
        }

        if (preg_match('/Bearer\s+(.*)$/i', trim($header), $matches)) {
            return $matches[1];
        }

        return null;
    }

    public static function user() {
        $token = self::getBearerToken();
        if (!$token) {
            return null;
        }

        require_once __DIR__ . '/../models/UserModel.php';
        $userModel = new UserModel();
        return $userModel->getByToken($token);
    }

    public static function requireUser() {
        $user = self::user();
        if (!$user) {
            sendJsonError('Authentication required', 401);
            exit;
        }
        return $user;
    }

    public static function requireManager() {
        $user = self::requireUser();
        if ($user['role'] !== 'manager') {
            sendJsonError('Manager access required', 403);
            exit;
        }
        return $user;
    }
}
