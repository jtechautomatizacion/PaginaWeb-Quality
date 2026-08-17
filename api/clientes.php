<?php

require_once __DIR__ . '/conexion.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$MAX_CLIENTES = 25;
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT * FROM clientes ORDER BY orden ASC');
    echo json_encode($stmt->fetchAll());
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
if (!is_array($body)) {
    $body = [];
}

if ($method === 'POST') {
    $nombre = trim($body['nombre'] ?? '');
    $logoUrl = trim($body['logo_url'] ?? '');
    if ($nombre === '' || $logoUrl === '') {
        http_response_code(400);
        echo json_encode(['ok' => false, 'message' => 'El nombre y el logo son requeridos.']);
        exit;
    }

    $total = (int) $pdo->query('SELECT COUNT(*) FROM clientes')->fetchColumn();
    if ($total >= $MAX_CLIENTES) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'message' => 'Ya alcanzaste el limite de ' . $MAX_CLIENTES . ' clientes. Elimina alguno antes de agregar otro.']);
        exit;
    }

    $timestamp = (int) round(microtime(true) * 1000);
    $maxOrden = (int) $pdo->query('SELECT COALESCE(MAX(orden), 0) FROM clientes')->fetchColumn();

    $item = [
        'id' => $timestamp,
        'nombre' => $nombre,
        'logo_url' => $logoUrl,
        'orden' => $maxOrden + 1,
        'timestamp' => $timestamp
    ];

    $stmt = $pdo->prepare('INSERT INTO clientes (id, nombre, logo_url, orden, timestamp) VALUES (:id, :nombre, :logo_url, :orden, :timestamp)');
    $stmt->execute($item);

    http_response_code(201);
    echo json_encode(['ok' => true, 'cliente' => $item]);
    exit;
}

$id = $_GET['id'] ?? null;
if (!$id) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'ID requerido.']);
    exit;
}

if ($method === 'PUT') {
    $stmt = $pdo->prepare('SELECT * FROM clientes WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $existente = $stmt->fetch();
    if (!$existente) {
        http_response_code(404);
        echo json_encode(['ok' => false, 'message' => 'Registro no encontrado.']);
        exit;
    }

    $nombre = trim($body['nombre'] ?? $existente['nombre']);
    if ($nombre === '') {
        http_response_code(400);
        echo json_encode(['ok' => false, 'message' => 'El nombre es requerido.']);
        exit;
    }

    $item = [
        'id' => $id,
        'nombre' => $nombre,
        'logo_url' => !empty($body['logo_url']) ? $body['logo_url'] : $existente['logo_url']
    ];

    $stmt = $pdo->prepare('UPDATE clientes SET nombre = :nombre, logo_url = :logo_url WHERE id = :id');
    $stmt->execute($item);

    echo json_encode(['ok' => true, 'cliente' => array_merge($existente, $item)]);
    exit;
}

if ($method === 'DELETE') {
    $stmt = $pdo->prepare('SELECT logo_url FROM clientes WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $existente = $stmt->fetch();
    if (!$existente) {
        http_response_code(404);
        echo json_encode(['ok' => false, 'message' => 'Registro no encontrado.']);
        exit;
    }

    $stmt = $pdo->prepare('DELETE FROM clientes WHERE id = :id');
    $stmt->execute(['id' => $id]);

    $logoUrl = $existente['logo_url'];
    if ($logoUrl && strpos($logoUrl, 'assets/uploads/') === 0) {
        $rutaLogo = realpath(__DIR__ . '/../' . $logoUrl);
        $uploadsRootReal = realpath(__DIR__ . '/../assets/uploads');
        if ($rutaLogo && $uploadsRootReal && strpos($rutaLogo, $uploadsRootReal) === 0 && is_file($rutaLogo)) {
            @unlink($rutaLogo);
        }
    }

    echo json_encode(['ok' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['ok' => false, 'message' => 'Metodo no permitido.']);
