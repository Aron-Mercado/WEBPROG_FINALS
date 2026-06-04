<?php
// backend/public/index.php

require_once __DIR__ . '/../config/http.php';

ensureEnvLoaded();

ini_set('display_errors', isAppDebug() ? '1' : '0');
ini_set('display_startup_errors', isAppDebug() ? '1' : '0');
error_reporting(isAppDebug() ? E_ALL : 0);

sendCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$scriptName = dirname($_SERVER['SCRIPT_NAME']);

if ($scriptName !== '/' && $scriptName !== '.') {
    $requestUri = preg_replace('#^' . preg_quote($scriptName, '#') . '#', '', $requestUri);
}

$path = trim($requestUri, '/');

if (strpos($path, 'api/') !== false) {
    $path = substr($path, strpos($path, 'api/'));
} elseif (preg_match('#\b(products|orders|login|register)\b#', $path, $matches, PREG_OFFSET_CAPTURE)) {
    $path = substr($path, $matches[0][1]);
}

if ($path === 'api' || strpos($path, 'api/') === 0 || strpos($path, 'products') === 0 || strpos($path, 'orders') === 0 || strpos($path, 'login') === 0 || strpos($path, 'register') === 0) {
    require_once __DIR__ . '/../routes/api.php';
    return;
}

sendJsonError('API endpoint not found', 404);
