<?php
require_once '../auth_check.php';
require_once '../../db/config.php';

$stmt = $pdo->query("SELECT * FROM categories ORDER BY id");
echo json_encode($stmt->fetchAll());

