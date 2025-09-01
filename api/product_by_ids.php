<?php
require_once '../db/config.php';
//termékek adatainak betöltése - ezt a kosárban lévő termékek adatainak lekérdezéséhez használjuk ajax hívások-ban ezt hívjuk adott esetben
$ids = isset($_GET['ids']) ? explode(',', $_GET['ids']) : [];

if (empty($ids)) {
    echo json_encode([]);
    exit;
}

$placeholders = implode(',', array_fill(0, count($ids), '?'));
$stmt = $pdo->prepare("SELECT * FROM products WHERE id IN ($placeholders)");
$stmt->execute($ids);
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($products);
