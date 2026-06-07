<?php
/**
 * ProductModel (Model) — SQL for products (menu + inventory).
 * archived=1 hides item from customer menu; managers can still list/edit it.
 */

require_once __DIR__ . '/../config/database.php';

class ProductModel {
    private $db;
    private $hasArchivedColumn = false;

    public function __construct() {
        $this->db = Database::connect();
        $this->hasArchivedColumn = $this->checkArchivedColumn();
    }

    /** Supports older DBs that might not have archived column yet */
    private function checkArchivedColumn() {
        try {
            $stmt = $this->db->prepare("SHOW COLUMNS FROM products LIKE 'archived'");
            $stmt->execute();
            return (bool) $stmt->fetch();
        } catch (PDOException $e) {
            return false;
        }
    }

    public function getAllProducts($includeArchived = false) {
        if ($this->hasArchivedColumn) {
            if ($includeArchived) {
                $stmt = $this->db->query('SELECT id, name, price, stock, archived FROM products ORDER BY id ASC');
            } else {
                $stmt = $this->db->prepare('SELECT id, name, price, stock, archived FROM products WHERE archived = 0 ORDER BY id ASC');
                $stmt->execute();
            }
        } else {
            $stmt = $this->db->query('SELECT id, name, price, stock FROM products ORDER BY id ASC');
        }
        return $this->normalizeProducts($stmt->fetchAll());
    }

    public function getProductById($id) {
        if ($this->hasArchivedColumn) {
            $stmt = $this->db->prepare('SELECT id, name, price, stock, archived FROM products WHERE id = ?');
        } else {
            $stmt = $this->db->prepare('SELECT id, name, price, stock FROM products WHERE id = ?');
        }
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ? $this->normalizeProduct($row) : false;
    }

    /** MySQL may return archived as "0"/"1" strings — force clean numbers for JSON */
    private function normalizeProduct(array $product) {
        if ($this->hasArchivedColumn && array_key_exists('archived', $product)) {
            $product['archived'] = (int) $product['archived'];
        }
        $product['price'] = (float) $product['price'];
        $product['stock'] = (int) $product['stock'];
        return $product;
    }

    private function normalizeProducts(array $products) {
        return array_map(fn ($row) => $this->normalizeProduct($row), $products);
    }

    public function createProduct($name, $price, $stock, $archived = 0) {
        if ($this->hasArchivedColumn) {
            $stmt = $this->db->prepare('INSERT INTO products (name, price, stock, archived) VALUES (?, ?, ?, ?)');
            $stmt->execute([$name, $price, $stock, $archived]);
        } else {
            $stmt = $this->db->prepare('INSERT INTO products (name, price, stock) VALUES (?, ?, ?)');
            $stmt->execute([$name, $price, $stock]);
        }
        return $this->db->lastInsertId();
    }

    public function updateProduct($id, $name, $price, $stock, $archived = 0) {
        if ($this->hasArchivedColumn) {
            $stmt = $this->db->prepare('UPDATE products SET name = ?, price = ?, stock = ?, archived = ? WHERE id = ?');
            return $stmt->execute([$name, $price, $stock, $archived, $id]);
        }

        $stmt = $this->db->prepare('UPDATE products SET name = ?, price = ?, stock = ? WHERE id = ?');
        return $stmt->execute([$name, $price, $stock, $id]);
    }

    public function updateStock($id, $stock) {
        $stmt = $this->db->prepare('UPDATE products SET stock = ? WHERE id = ?');
        return $stmt->execute([$stock, $id]);
    }

    public function archiveProduct($id, $archived) {
        if (!$this->hasArchivedColumn) {
            return false;
        }
        $stmt = $this->db->prepare('UPDATE products SET archived = ? WHERE id = ?');
        return $stmt->execute([$archived ? 1 : 0, $id]);
    }

    public function deleteProduct($id) {
        $stmt = $this->db->prepare('DELETE FROM products WHERE id = ?');
        return $stmt->execute([$id]);
    }

    /** Only succeeds if enough stock — prevents negative inventory */
    public function reduceStock($id, $quantity) {
        $stmt = $this->db->prepare('UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?');
        $stmt->execute([$quantity, $id, $quantity]);
        return $stmt->rowCount() === 1;
    }
}
