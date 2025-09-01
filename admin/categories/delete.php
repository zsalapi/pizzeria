<?php
require_once '../auth_check.php';
require_once '../../db/config.php';

$stmt = $pdo->prepare("DELETE FROM categories WHERE id=?");
$stmt->execute([$_POST['id']]);
echo json_encode(["success" => true]);

