<?php
require_once '../auth_check.php';
require_once '../../db/config.php';

$stmt = $pdo->prepare("SELECT * FROM categories WHERE id=?");
$stmt->execute([$_GET['id']]);
echo json_encode($stmt->fetch());

