<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Metodo no permitido.']);
    exit;
}

$MAX_BYTES = 10 * 1024 * 1024;
$ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'];
$ALLOWED_TABLES = ['servicios', 'proyectos', 'cursos', 'investigacion', 'acreditaciones', 'clientes', 'nosotros_staff', 'nosotros_bloques', 'docentes'];

$tabla = $_POST['tabla'] ?? '';
if (!in_array($tabla, $ALLOWED_TABLES, true)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Coleccion no valida.']);
    exit;
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'No se recibio ningun archivo.']);
    exit;
}

$file = $_FILES['file'];

if ($file['size'] > $MAX_BYTES) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'El archivo supera el limite de 10MB.']);
    exit;
}

$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if (!in_array($ext, $ALLOWED_EXT, true)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Formato no permitido. Usa JPG, PNG, GIF, WEBP o PDF.']);
    exit;
}

$archivoTipo = 'imagen';
if ($ext === 'pdf') {
    $archivoTipo = 'pdf';
    $firma = @file_get_contents($file['tmp_name'], false, null, 0, 5);
    if ($firma !== '%PDF-') {
        http_response_code(400);
        echo json_encode(['ok' => false, 'message' => 'El archivo no es un PDF valido.']);
        exit;
    }
} else {
    $imageInfo = @getimagesize($file['tmp_name']);
    if ($imageInfo === false) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'message' => 'El archivo no es una imagen valida.']);
        exit;
    }
}

$uploadsDir = __DIR__ . '/../assets/uploads/' . $tabla;
if (!is_dir($uploadsDir)) {
    mkdir($uploadsDir, 0755, true);
}

$nombreArchivo = uniqid($tabla . '_', true) . '.' . $ext;
$destino = $uploadsDir . '/' . $nombreArchivo;

if (!move_uploaded_file($file['tmp_name'], $destino)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'No se pudo guardar el archivo.']);
    exit;
}

$urlPublica = 'assets/uploads/' . $tabla . '/' . $nombreArchivo;

$anterior = $_POST['anterior'] ?? '';
if ($anterior !== '' && strpos($anterior, 'assets/uploads/') === 0) {
    $rutaAnterior = __DIR__ . '/../' . $anterior;
    $rutaAnteriorReal = realpath($rutaAnterior);
    $uploadsRootReal = realpath(__DIR__ . '/../assets/uploads');
    if ($rutaAnteriorReal && $uploadsRootReal && strpos($rutaAnteriorReal, $uploadsRootReal) === 0 && is_file($rutaAnteriorReal)) {
        @unlink($rutaAnteriorReal);
    }
}

echo json_encode(['ok' => true, 'url' => $urlPublica, 'tipo' => $archivoTipo]);
