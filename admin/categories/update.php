<?php
require_once '../auth_check.php';
header('Content-Type: application/json');
require_once '../../db/config.php';

$id = intval($_POST['id'] ?? 0);
$name = trim($_POST['name'] ?? '');

if ($id <= 0 || $name === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Érvénytelen adatok']);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE categories SET name = :name WHERE id = :id");
    $stmt->execute(['name' => $name, 'id' => $id]);

    echo json_encode(['id' => $id, 'name' => $name]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Nem sikerült frissíteni a kategóriát: ' . $e->getMessage()]);
}
