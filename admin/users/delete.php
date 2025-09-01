<?php
require_once '../auth_check.php';
require_once '../../db/config.php';


$id = $_POST['id'] ?? null;
if (!$id) {
  echo json_encode(['success' => false, 'error' => 'Nincs megadva ID']);
  exit;
}

$stmt = $pdo->prepare("DELETE FROM users WHERE id=?");
$stmt->execute([$id]);

echo json_encode(['success' => true]);

