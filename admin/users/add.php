<?php
require_once '../auth_check.php';
require_once '../../db/config.php';


$name = $_POST['name'] ?? '';
$role = $_POST['role'] ?? 'customer';
$password = $_POST['password'] ?? '';

if (!$name || !$password) {
  echo json_encode(['success' => false, 'error' => 'Név és jelszó megadása kötelező!']);
  exit;
}

// sha256 titkosítás
$passwordHash = hash('sha256', $password);

$stmt = $pdo->prepare("INSERT INTO users (name, role, password) VALUES (?, ?, ?)");
$stmt->execute([$name, $role, $passwordHash]);

echo json_encode(['success' => true]);

