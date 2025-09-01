<?php
require_once '../auth_check.php';
require_once '../../db/config.php';

$orderId = $_GET['order_id'] ?? 0;

$stmt = $pdo->prepare("
  SELECT p.id, p.name, p.price, op.count 
  FROM ordered_products op
  JOIN products p ON p.id = op.product_id
  WHERE op.order_id = ?
");
$stmt->execute([$orderId]);
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($products);
