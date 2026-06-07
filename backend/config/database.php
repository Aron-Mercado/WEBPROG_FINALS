<?php
/**
 * database.php — opens ONE shared MySQL connection (PDO).
 *
 * Analogy: .env has the Wi‑Fi password; this file actually connects.
 * Models call Database::connect() — they don't read .env themselves.
 */

require_once __DIR__ . '/env.php';
require_once __DIR__ . '/http.php';

class Database {
    /** Reused for every model in the same request (efficient) */
    private static ?PDO $pdo = null;

    public static function connect(): PDO {
        if (self::$pdo === null) {
            ensureEnvLoaded();

            // Values from backend/.env (not hardcoded here)
            $host = env('DB_HOST', 'localhost');
            $dbName = env('DB_NAME', 'food_delivery');
            $username = env('DB_USER', 'root');
            $password = env('DB_PASS', '');
            $charset = env('DB_CHARSET', 'utf8mb4');

            $dsn = "mysql:host={$host};dbname={$dbName};charset={$charset}";

            try {
                self::$pdo = new PDO($dsn, $username, $password, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]);
            } catch (PDOException $e) {
                $payload = ['error' => 'Database connection failed'];
                // Only show MySQL error details when debugging locally
                if (isAppDebug()) {
                    $payload['message'] = $e->getMessage();
                }
                sendJson($payload, 500);
                exit;
            }
        }

        return self::$pdo;
    }
}
