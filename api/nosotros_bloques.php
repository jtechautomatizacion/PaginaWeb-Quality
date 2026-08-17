<?php

require_once __DIR__ . '/conexion.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT * FROM nosotros_bloques ORDER BY orden ASC');
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($method !== 'PUT') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Metodo no permitido.']);
    exit;
}

$clave = $_GET['clave'] ?? null;
if (!$clave) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Clave requerida.']);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
if (!is_array($body)) {
    $body = [];
}

$stmt = $pdo->prepare('SELECT * FROM nosotros_bloques WHERE clave = :clave');
$stmt->execute(['clave' => $clave]);
$existente = $stmt->fetch();
if (!$existente) {
    http_response_code(404);
    echo json_encode(['ok' => false, 'message' => 'Bloque no encontrado.']);
    exit;
}

$titulo = trim($body['titulo'] ?? $existente['titulo']);
$contenido = $body['contenido'] ?? $existente['contenido'];
$imagen = isset($body['imagen']) && $body['imagen'] !== '' ? $body['imagen'] : $existente['imagen'];

if ($titulo === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'El titulo es requerido.']);
    exit;
}

$stmt = $pdo->prepare('UPDATE nosotros_bloques SET titulo = :titulo, contenido = :contenido, imagen = :imagen WHERE clave = :clave');
$stmt->execute(['titulo' => $titulo, 'contenido' => $contenido, 'imagen' => $imagen, 'clave' => $clave]);

echo json_encode(['ok' => true, 'bloque' => array_merge($existente, ['titulo' => $titulo, 'contenido' => $contenido, 'imagen' => $imagen])]);
