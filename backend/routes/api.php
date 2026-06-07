<?php
/**
 * api.php — ROUTER: maps URL + HTTP method → controller method.
 *
 * Example: PUT /api/products/3 → ProductController::update(3)
 *          POST /api/login     → AuthController::login()
 */

require_once __DIR__ . '/../controllers/ProductController.php';
require_once __DIR__ . '/../controllers/OrderController.php';
require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../config/auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$scriptName = dirname($_SERVER['SCRIPT_NAME']);

if ($scriptName !== '/' && $scriptName !== '.') {
    $requestUri = preg_replace('#^' . preg_quote($scriptName, '#') . '#', '', $requestUri);
}

$path = trim($requestUri, '/');

if (strpos($path, 'api/') !== false) {
    $path = substr($path, strpos($path, 'api/') + strlen('api/'));
} elseif (preg_match('#\b(products|orders|login|register|logout)\b#', $path, $matches, PREG_OFFSET_CAPTURE)) {
    $path = substr($path, $matches[0][1]);
}

// e.g. ["products", "5"] or ["orders", "status", "2"]
$segments = array_values(array_filter(explode('/', trim($path, '/'))));

if (count($segments) === 0) {
    sendJsonError('Endpoint not found', 404);
    return;
}

$productController = new ProductController();
$orderController = new OrderController();
$authController = new AuthController();

if ($segments[0] === 'register' && $method === 'POST' && count($segments) === 1) {
    $authController->register();
    return;
}

if ($segments[0] === 'login' && $method === 'POST' && count($segments) === 1) {
    $authController->login();
    return;
}

if ($segments[0] === 'logout' && $method === 'POST' && count($segments) === 1) {
    $authController->logout();
    return;
}

if ($segments[0] === 'products') {
    // Managers pass ?archived=1 to see hidden menu items
    $includeArchived = isset($_GET['archived']) && $_GET['archived'] === '1';

    if ($method === 'GET' && count($segments) === 1) {
        $productController->list($includeArchived);
        return;
    }

    if ($method === 'POST' && count($segments) === 1) {
        $productController->create();
        return;
    }

    if (($method === 'PUT' || $method === 'PATCH') && count($segments) === 2 && is_numeric($segments[1])) {
        $productController->update(intval($segments[1]));
        return;
    }

    if ($method === 'DELETE' && count($segments) === 2 && is_numeric($segments[1])) {
        $productController->delete(intval($segments[1]));
        return;
    }
}

if ($segments[0] === 'orders') {
    if ($method === 'GET' && count($segments) === 1) {
        $orderController->list(Auth::user());
        return;
    }

    if ($method === 'POST' && count($segments) === 1) {
        $orderController->create(Auth::user());
        return;
    }

    if (($method === 'PUT' || $method === 'PATCH') && count($segments) === 3 && $segments[1] === 'status' && is_numeric($segments[2])) {
        $orderController->updateStatus(intval($segments[2]));
        return;
    }
}

sendJsonError('Endpoint not found', 404);
