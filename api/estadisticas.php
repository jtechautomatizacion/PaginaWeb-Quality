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
    $stmt = $pdo->query('SELECT * FROM estadisticas ORDER BY orden ASC');
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

$stmt = $pdo->prepare('SELECT * FROM estadisticas WHERE id = :id');
$stmt->execute(['id' => $id]);
$existente = $stmt->fetch();
if (!$existente) {
    http_response_code(404);
    echo json_encode(['ok' => false, 'message' => 'Registro no encontrado.']);
    exit;
}

$valor = trim($body['valor'] ?? $existente['valor']);
$etiqueta = trim($body['etiqueta'] ?? $existente['etiqueta']);
if ($valor === '' || $etiqueta === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'El valor y la etiqueta son requeridos.']);
    exit;
}

$stmt = $pdo->prepare('UPDATE estadisticas SET valor = :valor, etiqueta = :etiqueta WHERE id = :id');
$stmt->execute(['valor' => $valor, 'etiqueta' => $etiqueta, 'id' => $id]);

echo json_encode(['ok' => true, 'estadistica' => array_merge($existente, ['valor' => $valor, 'etiqueta' => $etiqueta])]);
