<?php
// backend/config/http.php — shared JSON / CORS helpers

require_once __DIR__ . '/env.php';

function ensureEnvLoaded(): void {
    static $loaded = false;
    if ($loaded) {
        return;
    }
    loadEnv(dirname(__DIR__) . '/.env');
    $loaded = true;
}

function sendCorsHeaders(): void {
    ensureEnvLoaded();
    $origin = env('CORS_ORIGIN', 'http://localhost:5173');
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Credentials: true');
}

function sendJson(array $data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
}

function sendJsonError(string $message, int $status = 400): void {
    sendJson(['error' => $message], $status);
}
