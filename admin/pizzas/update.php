<?php
require_once '../auth_check.php';
require_once "../../db/config.php";

$id = $_POST['id'];
$name = $_POST['name'];
$price = $_POST['price'];
$category_id = $_POST['category_id'];
$old_picture = $_POST['old_picture'] ?? '';

$picture = $old_picture;

// Kép feltöltés és feldolgozás
if (isset($_FILES['picture_file']) && $_FILES['picture_file']['error'] === UPLOAD_ERR_OK) {
  $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  $fileType = mime_content_type($_FILES['picture_file']['tmp_name']);

  if (!in_array($fileType, $allowedTypes)) {
    http_response_code(400);
    echo "Nem támogatott képtípus: $fileType";
    exit;
  }

  $ext = pathinfo($_FILES['picture_file']['name'], PATHINFO_EXTENSION);
  $newFileName = uniqid() . '.' . $ext;
  $uploadDir = __DIR__ . '/../../imgs/';
  $uploadPath = $uploadDir . $newFileName;

  $tmpPath = $_FILES['picture_file']['tmp_name'];
  list($originalWidth, $originalHeight) = getimagesize($tmpPath);

  $maxWidth = 400;
  $maxHeight = 200;

  // Méretarány megtartása mellett kiszámoljuk a célméreteket
  $scale = min($maxWidth / $originalWidth, $maxHeight / $originalHeight, 1);
  $newWidth = (int) ($originalWidth * $scale);
  $newHeight = (int) ($originalHeight * $scale);

  // Kép betöltése
  switch ($fileType) {
    case 'image/jpeg':
      $srcImage = imagecreatefromjpeg($tmpPath);
      break;
    case 'image/png':
      $srcImage = imagecreatefrompng($tmpPath);
      break;
    case 'image/gif':
      $srcImage = imagecreatefromgif($tmpPath);
      break;
    case 'image/webp':
      $srcImage = imagecreatefromwebp($tmpPath);
      break;
    default:
      http_response_code(400);
      echo "Nem támogatott képtípus.";
      exit;
  }

  $dstImage = imagecreatetruecolor($newWidth, $newHeight);

  // Átlátszóság megőrzése
  if (in_array($fileType, ['image/png', 'image/webp'])) {
    imagealphablending($dstImage, false);
    imagesavealpha($dstImage, true);
    $transparent = imagecolorallocatealpha($dstImage, 0, 0, 0, 127);
    imagefill($dstImage, 0, 0, $transparent);
  }

  // Átméretezés
  imagecopyresampled(
    $dstImage,
    $srcImage,
    0,
    0,
    0,
    0,
    $newWidth,
    $newHeight,
    $originalWidth,
    $originalHeight
  );

  // Mentés képtípustól függően a diszkre
  switch ($fileType) {
    case 'image/jpeg':
      imagejpeg($dstImage, $uploadPath, 90);
      break;
    case 'image/png':
      imagepng($dstImage, $uploadPath);
      break;
    case 'image/gif':
      imagegif($dstImage, $uploadPath);
      break;
    case 'image/webp':
      imagewebp($dstImage, $uploadPath);
      break;
  }

  imagedestroy($srcImage);
  imagedestroy($dstImage);

  // Régi kép törlése
  if (!empty($old_picture)) {
    $oldPath = $uploadDir . $old_picture;
    if (file_exists($oldPath)) {
      unlink($oldPath);
    }
  }

  $picture = $newFileName;
}

// Frissítés az adatbázisban
$stmt = $pdo->prepare("UPDATE products SET name = ?, price = ?, category_id = ?, picture = ? WHERE id = ?");
$stmt->execute([$name, $price, $category_id, $picture, $id]);

echo "OK";
