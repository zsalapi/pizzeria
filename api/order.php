<?php
session_start();
require_once '../db/config.php';
header('Content-Type: application/json');

// Hiba naplózása
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// JSON beolvasás
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

// Alapértelmezett hibaellenőrzés
if (
  !$data ||
  !isset($data['name'], $data['phone'], $data['address'], $data['items']) ||
  !is_array($data['items']) ||
  count($data['items']) === 0
) {
  http_response_code(400);
  echo json_encode(['success' => false, 'error' => 'Hiányzó vagy hibás adatok']);
  exit;
}

$name = trim($data['name']);
$phone = trim($data['phone']);
$address = trim($data['address']);
$items = $data['items'];

// --- VALIDÁCIÓK ---

// Név: legalább 2 karakter, csak betűk, szóköz és kötőjel
if (mb_strlen($name) < 2 || !preg_match('/^[\p{L}\s\-]+$/u', $name)) {
  http_response_code(400);
  echo json_encode(['success' => false, 'error' => 'Érvénytelen név']);
  exit;
}

// Telefonszám: legalább 9 számjegy, csak szám és +
if (!preg_match('/^\+?[0-9]{9,15}$/', $phone)) {
  http_response_code(400);
  echo json_encode(['success' => false, 'error' => 'Érvénytelen telefonszám']);
  exit;
}

// Cím: legalább 5 karakter
if (mb_strlen($address) < 5) {
  http_response_code(400);
  echo json_encode(['success' => false, 'error' => 'Érvénytelen cím']);
  exit;
}

// Tételek validálása
foreach ($items as $item) {
  if (
    !isset($item['product_id']) || !isset($item['count']) ||
    !is_numeric($item['product_id']) || !is_numeric($item['count']) ||
    intval($item['product_id']) <= 0 || intval($item['count']) <= 0
  ) {
    http_response_code(400);
    echo json_encode([
      'success' => false,
      'error' => 'Hibás tétel adat: ' . json_encode($item)
    ]);
    exit;
  }
}

try {
  $pdo->beginTransaction();

  // Megrendelés beszúrása
  $stmt = $pdo->prepare("INSERT INTO orders (name, phone, address, status, created_at) VALUES (?, ?, ?, ?, NOW())");
  $stmt->execute([$name, $phone, $address, 'Folyamatban']);

  $order_id = $pdo->lastInsertId();

  // Tételek mentése
  $stmtProduct = $pdo->prepare("INSERT INTO ordered_products (order_id, product_id, count) VALUES (?, ?, ?)");

  foreach ($items as $item) {
    $product_id = (int) $item['product_id'];
    $count = (int) $item['count'];
    $stmtProduct->execute([$order_id, $product_id, $count]);
  }

  $pdo->commit();

  echo json_encode([
    'success' => true,
    'order_id' => $order_id
  ]);
} catch (Exception $e) {
  $pdo->rollBack();
  http_response_code(500);
  echo json_encode([
    'success' => false,
    'error' => 'Hiba történt a rendelés feldolgozása során: ' . $e->getMessage()
  ]);
}
