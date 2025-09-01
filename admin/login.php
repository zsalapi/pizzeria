<?php
session_start();
require_once '../db/config.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $name = trim($_POST['name'] ?? '');
  $password = trim($_POST['password']) ?? '';

  if (!$name || !$password) {
    echo json_encode(['success' => false, 'error' => 'Hiányzó felhasználónév vagy jelszó']);
    exit;
  }

  $stmt = $pdo->prepare("SELECT * FROM users WHERE name = ?");
  $stmt->execute([$name]);
  $user = $stmt->fetch();

  // 🔐 A JELSZÓT ITT HASH-ELJÜK
  if ($user && hash('sha256', $password) === $user['password'] && $user['role'] == 'admin') {
    $_SESSION['user'] = [
      'id' => $user['id'],
      'name' => $user['name'],
      'role' => $user['role']
    ];
    if ($user['role'] == 'admin') {
      $_SESSION["admin_logged_in"] = true;
    }
    echo json_encode(['success' => true]);
  } else {
    echo json_encode(['success' => false, 'error' => 'Hibás felhasználónév vagy jelszó, vagy nincs jogod belépni']);
  }
}
