<?php
require_once '../auth_check.php';
require_once '../../db/config.php';


$allowedStatuses = ['Folyamatban', 'Teljesítve', 'Lemondva'];
$id = $_POST['id'] ?? null;
$status = $_POST['status'] ?? null;

if (!$id || !in_array($status, $allowedStatuses)) {
  echo json_encode(['success' => false, 'error' => 'Érvénytelen adatok']);
  exit;
}

$stmt = $pdo->prepare("UPDATE orders SET status=? WHERE id=?");
$stmt->execute([$status, $id]);

echo json_encode(['success' => true]);

