<?php
require_once '../auth_check.php';
require_once "../../db/config.php";

$stmt = $pdo->query("
  SELECT p.id, p.name, p.price, p.picture, p.category_id, c.name AS category_name
  FROM products p
  JOIN categories c ON p.category_id = c.id
");

$pizzas = $stmt->fetchAll();

// Minden pizzához hozzáadjuk a teljes képútvonalat
foreach ($pizzas as &$pizza) {
  if (!empty($pizza['picture'])) {
    $pizza['picture'] = '/pizzeria/imgs/' . $pizza['picture'];
  } else {
    $pizza['picture'] = ""; // vagy default.png ha van
  }
}

echo json_encode($pizzas);
