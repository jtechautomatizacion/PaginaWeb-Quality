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
    $stmt = $pdo->query('SELECT * FROM nosotros_trayectoria ORDER BY orden ASC');
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($method !== 'PUT') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Metodo no permitido.']);
    exit;
}

$id = $_GET['id'] ?? null;
if (!$id) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'ID requerido.']);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
if (!is_array($body)) {
    $body = [];
}

$stmt = $pdo->prepare('SELECT * FROM nosotros_trayectoria WHERE id = :id');
$stmt->execute(['id' => $id]);
$existente = $stmt->fetch();
if (!$existente) {
    http_response_code(404);
    echo json_encode(['ok' => false, 'message' => 'Registro no encontrado.']);
    exit;
}

$numero = trim($body['numero'] ?? $existente['numero']);
$etiqueta = trim($body['etiqueta'] ?? $existente['etiqueta']);
if ($numero === '' || $etiqueta === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'El numero y la etiqueta son requeridos.']);
    exit;
}

$item = [
    'id' => $id,
    'numero' => $numero,
    'sufijo' => $body['sufijo'] ?? $existente['sufijo'],
    'etiqueta' => $etiqueta,
    'enlace_texto' => $body['enlace_texto'] ?? $existente['enlace_texto'],
    'enlace_url' => $body['enlace_url'] ?? $existente['enlace_url']
];

$stmt = $pdo->prepare('UPDATE nosotros_trayectoria SET numero = :numero, sufijo = :sufijo, etiqueta = :etiqueta, enlace_texto = :enlace_texto, enlace_url = :enlace_url WHERE id = :id');
$stmt->execute($item);

echo json_encode(['ok' => true, 'trayectoria' => array_merge($existente, $item)]);
