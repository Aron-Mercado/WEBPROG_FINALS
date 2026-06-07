<?php
/**
 * http.php — shared HTTP helpers for the API.
 * Stops us repeating CORS headers and JSON output in every controller.
 */

require_once __DIR__ . '/env.php';

/** Load .env once per request (static = remembers for rest of request) */
function ensureEnvLoaded(): void {
    static $loaded = false;
    if ($loaded) {
        return;
    }
    loadEnv(dirname(__DIR__) . '/.env');
    $loaded = true;
}

/**
 * CORS lets the React app (different port/URL) call this PHP API.
 * CORS_ORIGIN in .env should match your Vite URL (e.g. http://localhost:5173).
 */
function sendCorsHeaders(): void {
    ensureEnvLoaded();
    $origin = env('CORS_ORIGIN', 'http://localhost:5173');
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Credentials: true');
}

/** Send a JSON body with HTTP status code */
function sendJson(array $data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
}

/** Standard error shape the React app expects: { "error": "message" } */
function sendJsonError(string $message, int $status = 400): void {
    sendJson(['error' => $message], $status);
}
