<?php
header('Content-Type: application/json; charset=utf-8');
session_start();
require_once '../db/config.php';

$stmt = $pdo->query("SELECT id, name FROM categories ORDER BY name");
$categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($categories);