<?php
require_once '../auth_check.php';
require_once '../../db/config.php';


$id = $_POST['id'] ?? null;
$name = $_POST['name'] ?? '';
$role = $_POST['role'] ?? 'customer';
$password = $_POST['password'] ?? '';

if (!$id || !$name) {
  echo json_encode(['success' => false, 'error' => 'Hiányzó adatok']);
  exit;
}

if ($password) {
  $passwordHash = hash('sha256', $password);
  $stmt = $pdo->prepare("UPDATE users SET name=?, role=?, password=? WHERE id=?");
  $stmt->execute([$name, $role, $passwordHash, $id]);
} else {
  $stmt = $pdo->prepare("UPDATE users SET name=?, role=? WHERE id=?");
  $stmt->execute([$name, $role, $id]);
}

echo json_encode(['success' => true]);

