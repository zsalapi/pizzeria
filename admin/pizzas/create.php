<?php
require_once '../auth_check.php';
require_once "../../db/config.php";

$name = $_POST['name'] ?? '';
$price = floatval($_POST['price'] ?? 0);
$category_id = intval($_POST['category_id'] ?? 0);
$picture = ''; // csak a fájlnév kerül adatbázisba

// Kép feltöltés és feldolgozás
if (isset($_FILES['picture_file']) && $_FILES['picture_file']['error'] === UPLOAD_ERR_OK) {
    $tmpPath = $_FILES['picture_file']['tmp_name'];
    $fileType = mime_content_type($tmpPath);

    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($fileType, $allowedTypes)) {
        http_response_code(400);
        echo "Nem támogatott képtípus: $fileType";
        exit;
    }

    $ext = pathinfo($_FILES['picture_file']['name'], PATHINFO_EXTENSION);
    $newFileName = uniqid("img_") . '.' . $ext;

    $uploadDir = __DIR__ . '/../../imgs/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $uploadPath = $uploadDir . $newFileName;

    list($originalWidth, $originalHeight) = getimagesize($tmpPath);
    $maxWidth = 400;
    $maxHeight = 200;

    // Arányos méretezés
    $scale = min($maxWidth / $originalWidth, $maxHeight / $originalHeight, 1);
    $newWidth = (int) ($originalWidth * $scale);
    $newHeight = (int) ($originalHeight * $scale);

    // Betöltés képtípustól függően
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
    }

    $dstImage = imagecreatetruecolor($newWidth, $newHeight);

    // Átlátszóság megőrzése
    if (in_array($fileType, ['image/png', 'image/webp'])) {
        imagealphablending($dstImage, false);
        imagesavealpha($dstImage, true);
        $transparent = imagecolorallocatealpha($dstImage, 0, 0, 0, 127);
        imagefill($dstImage, 0, 0, $transparent);
    }

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
    //az új fájlnevet fogjuk elrakni majd a db-be
    $picture = $newFileName;
}

// Adatbázisba mentés
try {
    $stmt = $pdo->prepare("INSERT INTO products (name, price, category_id, picture) VALUES (?, ?, ?, ?)");
    $stmt->execute([$name, $price, $category_id, $picture]);
    echo "OK";
} catch (PDOException $e) {
    http_response_code(500);
    echo "Adatbázis hiba: " . $e->getMessage();
}
