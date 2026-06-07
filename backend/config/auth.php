<?php
/**
 * auth.php — who is logged in?
 *
 * Frontend sends: Authorization: Bearer <token>
 * We look up that token in the users table and check role (customer vs manager).
 */

require_once __DIR__ . '/http.php';

class Auth {
    /** Pull token from the Authorization header sent by api.js */
    public static function getBearerToken() {
        $header = null;

        // Apache + mod_rewrite often strips Authorization; check every common location
        if (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
            $header = $_SERVER['HTTP_AUTHORIZATION'];
        } elseif (!empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $header = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        } elseif (function_exists('getallheaders')) {
            $headers = getallheaders();
            if (isset($headers['Authorization'])) {
                $header = $headers['Authorization'];
            } elseif (isset($headers['authorization'])) {
                $header = $headers['authorization'];
            }
        } elseif (function_exists('apache_request_headers')) {
            $headers = apache_request_headers();
            if (isset($headers['Authorization'])) {
                $header = $headers['Authorization'];
            } elseif (isset($headers['authorization'])) {
                $header = $headers['authorization'];
            }
        }

        if (!$header || !preg_match('/Bearer\s+(.*)$/i', trim($header), $matches)) {
            return null;
        }

        return trim($matches[1]);
    }

    /** Returns user row or null if not logged in */
    public static function user() {
        $token = self::getBearerToken();
        if (!$token) {
            return null;
        }

        require_once __DIR__ . '/../models/UserModel.php';
        $userModel = new UserModel();
        return $userModel->getByToken($token);
    }

    /** Stops the request with 401 if no valid login */
    public static function requireUser() {
        $user = self::user();
        if (!$user) {
            sendJsonError('Authentication required', 401);
            exit;
        }
        return $user;
    }

    /** Stops the request with 403 if user is not a manager */
    public static function requireManager() {
        $user = self::requireUser();
        if ($user['role'] !== 'manager') {
            sendJsonError('Manager access required', 403);
            exit;
        }
        return $user;
    }
}
