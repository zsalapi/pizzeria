<?php
require_once '../auth_check.php';
require_once '../../db/config.php';

$id = $_GET['id'] ?? null;
if (!$id) {
  echo json_encode(null);
  exit;
}

$stmt = $pdo->prepare("SELECT id, name, role FROM users WHERE id=?");
$stmt->execute([$id]);
echo json_encode($stmt->fetch());

