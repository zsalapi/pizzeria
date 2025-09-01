<?php
require_once '../auth_check.php';
require_once '../../db/config.php';


$stmt = $pdo->query("SELECT * FROM orders ORDER BY created_at DESC");
echo json_encode($stmt->fetchAll());

