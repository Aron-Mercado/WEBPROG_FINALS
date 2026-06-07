<?php
/**
 * env.php — reads backend/.env (your private config file, not on GitHub).
 *
 * .env stores VALUES (password, host). This file reads them into env('DB_PASS').
 * Other files never hardcode secrets; they call env() instead.
 */

function loadEnv(string $filePath): void {
    if (!is_readable($filePath)) {
        return; // No .env yet — env() will use defaults
    }

    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return;
    }

    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue; // Skip blanks and comments
        }
        if (!str_contains($line, '=')) {
            continue;
        }

        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value, " \t\n\r\0\x0B\"'");

        $_ENV[$key] = $value;
        putenv("$key=$value"); // Makes values available to env() and getenv()
    }
}

/** Get one setting from .env, or $default if missing */
function env(string $key, string $default = ''): string {
    if (isset($_ENV[$key]) && $_ENV[$key] !== '') {
        return $_ENV[$key];
    }
    $fromGetenv = getenv($key);
    return $fromGetenv !== false ? $fromGetenv : $default;
}

/** When true, PHP shows detailed errors (local dev only) */
function isAppDebug(): bool {
    return in_array(strtolower(env('APP_DEBUG', 'false')), ['1', 'true', 'yes', 'on'], true);
}
