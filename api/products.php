<?php
header('Content-Type: application/json; charset=utf-8');
session_start();
require_once '../db/config.php';

$category_id = $_GET['category_id'] ?? null;

if ($category_id) {
  $stmt = $pdo->prepare("SELECT id, category_id, name, price, picture FROM products WHERE category_id = ? ORDER BY name");
  $stmt->execute([$category_id]);
} else {
  $stmt = $pdo->query("SELECT id, category_id, name, price, picture FROM products ORDER BY name");
}

echo json_encode($stmt->fetchAll());
