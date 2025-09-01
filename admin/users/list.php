<?php
require_once '../auth_check.php';
require_once '../../db/config.php';


$stmt = $pdo->query("SELECT id, name, role FROM users");
echo json_encode($stmt->fetchAll());

