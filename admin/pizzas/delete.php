<?php
require_once '../auth_check.php';
require_once '../../db/config.php';



$id = $_POST['id'] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode(["error" => "Hiányzó termék ID."]);
    exit;
}

// Lekérjük a kép fájlnevét
$stmt = $pdo->prepare("SELECT picture FROM products WHERE id = ?");
$stmt->execute([$id]);
$product = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$product) {
    http_response_code(404);
    echo json_encode(["error" => "A termék nem található."]);
    exit;
}

// Töröljük a terméket
$stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
$stmt->execute([$id]);

// Kép törlése, ha van és létezik
if (!empty($product['picture'])) {
    $path = __DIR__ . '/../../imgs/' . $product['picture'];
    if (file_exists($path)) {
        unlink($path);
    }
}

echo json_encode(["success" => true]);
