<?php
/**
 * index.php — FRONT CONTROLLER (every API request starts here).
 *
 * Flow: Browser → Apache → this file → routes/api.php → Controller → Model → MySQL
 */

require_once __DIR__ . '/../config/http.php';

ensureEnvLoaded();

// Hide PHP errors on GitHub/production; show them locally when APP_DEBUG=true
ini_set('display_errors', isAppDebug() ? '1' : '0');
ini_set('display_startup_errors', isAppDebug() ? '1' : '0');
error_reporting(isAppDebug() ? E_ALL : 0);

sendCorsHeaders();

// Browser "preflight" check before POST/PUT — answer OK and stop
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Strip folder path so we get clean segments like "products/5"
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$scriptName = dirname($_SERVER['SCRIPT_NAME']);

if ($scriptName !== '/' && $scriptName !== '.') {
    $requestUri = preg_replace('#^' . preg_quote($scriptName, '#') . '#', '', $requestUri);
}

$path = trim($requestUri, '/');

if (strpos($path, 'api/') !== false) {
    $path = substr($path, strpos($path, 'api/'));
} elseif (preg_match('#\b(products|orders|login|register|logout)\b#', $path, $matches, PREG_OFFSET_CAPTURE)) {
    $path = substr($path, $matches[0][1]);
}

// Hand off to the router if this looks like an API call
if ($path === 'api' || strpos($path, 'api/') === 0 || strpos($path, 'products') === 0 || strpos($path, 'orders') === 0 || strpos($path, 'login') === 0 || strpos($path, 'register') === 0 || strpos($path, 'logout') === 0) {
    require_once __DIR__ . '/../routes/api.php';
    return;
}

sendJsonError('API endpoint not found', 404);
