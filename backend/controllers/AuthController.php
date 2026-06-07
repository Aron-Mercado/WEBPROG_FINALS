<?php
/**
 * AuthController — login and register (Controller layer).
 * Validates input, hashes passwords, returns JSON + api token for the frontend.
 */

require_once __DIR__ . '/../models/UserModel.php';

class AuthController {
    private $userModel;

    public function __construct() {
        $this->userModel = new UserModel();
    }

    /** Random token stored in DB; frontend sends it on every request as Bearer token */
    private function generateToken() {
        return bin2hex(random_bytes(24));
    }

    public function register() {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['username'], $data['password'])) {
            http_response_code(400);
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Username and password are required']);
            return;
        }

        $username = trim($data['username']);
        $password = trim($data['password']);

        if ($username === '' || $password === '') {
            http_response_code(400);
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Username and password may not be empty']);
            return;
        }

        if ($this->userModel->getByUsername($username)) {
            http_response_code(409);
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Username already exists']);
            return;
        }

        // Never store plain text — only bcrypt hash in the database
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        $token = $this->generateToken();
        $this->userModel->createUser($username, $passwordHash, 'customer', $token);

        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'user' => ['username' => $username, 'role' => 'customer'], 'token' => $token]);
    }

    public function login() {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['username'], $data['password'])) {
            http_response_code(400);
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Username and password are required']);
            return;
        }

        $username = trim($data['username']);
        $password = trim($data['password']);
        $user = $this->userModel->getByUsername($username);

        if (!$user || !password_verify($password, $user['password'])) {
            http_response_code(401);
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Invalid username or password']);
            return;
        }

        // New token each login (old sessions stop working)
        $token = $this->generateToken();
        $this->userModel->updateToken($user['id'], $token);

        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'user' => ['username' => $user['username'], 'role' => $user['role']], 'token' => $token]);
    }
}
