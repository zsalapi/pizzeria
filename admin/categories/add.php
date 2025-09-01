<?php
require_once '../auth_check.php';
header('Content-Type: application/json');
require_once '../../db/config.php';

$name = trim($_POST['name'] ?? '');

if ($name === '') {
    http_response_code(400);
    echo json_encode(['error' => 'A kategória neve nem lehet üres.']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO categories (name) VALUES (:name)");
    $stmt->execute(['name' => $name]);

    echo json_encode(['id' => $pdo->lastInsertId(), 'name' => $name]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Nem sikerült menteni a kategóriát: ' . $e->getMessage()]);
}
