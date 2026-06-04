<?php
// backend/config/env.php — loads secrets from backend/.env (not committed to Git)

function loadEnv(string $filePath): void {
    if (!is_readable($filePath)) {
        return;
    }

    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return;
    }

    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }
        if (!str_contains($line, '=')) {
            continue;
        }

        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value, " \t\n\r\0\x0B\"'");

        $_ENV[$key] = $value;
        putenv("$key=$value");
    }
}

function env(string $key, string $default = ''): string {
    if (isset($_ENV[$key]) && $_ENV[$key] !== '') {
        return $_ENV[$key];
    }
    $fromGetenv = getenv($key);
    return $fromGetenv !== false ? $fromGetenv : $default;
}

function isAppDebug(): bool {
    return in_array(strtolower(env('APP_DEBUG', 'false')), ['1', 'true', 'yes', 'on'], true);
}
