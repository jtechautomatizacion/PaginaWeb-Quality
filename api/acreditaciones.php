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

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT * FROM acreditaciones ORDER BY orden ASC');
    echo json_encode($stmt->fetchAll());
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
if (!is_array($body)) {
    $body = [];
}

if ($method === 'POST') {
    $titulo = trim($body['titulo'] ?? '');
    if ($titulo === '') {
        http_response_code(400);
        echo json_encode(['ok' => false, 'message' => 'El titulo es requerido.']);
        exit;
    }

    $timestamp = (int) round(microtime(true) * 1000);
    $maxOrden = (int) $pdo->query('SELECT COALESCE(MAX(orden), 0) FROM acreditaciones')->fetchColumn();

    $item = [
        'id' => $timestamp,
        'titulo' => $titulo,
        'descripcion' => $body['descripcion'] ?? '',
        'archivo_url' => $body['archivo_url'] ?? '',
        'archivo_tipo' => in_array($body['archivo_tipo'] ?? '', ['pdf', 'imagen'], true) ? $body['archivo_tipo'] : '',
        'orden' => $maxOrden + 1,
        'timestamp' => $timestamp
    ];

    $stmt = $pdo->prepare('INSERT INTO acreditaciones (id, titulo, descripcion, archivo_url, archivo_tipo, orden, timestamp) VALUES (:id, :titulo, :descripcion, :archivo_url, :archivo_tipo, :orden, :timestamp)');
    $stmt->execute($item);

    http_response_code(201);
    echo json_encode(['ok' => true, 'acreditacion' => $item]);
    exit;
}

$id = $_GET['id'] ?? null;
if (!$id) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'ID requerido.']);
    exit;
}

if ($method === 'PUT') {
    $stmt = $pdo->prepare('SELECT * FROM acreditaciones WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $existente = $stmt->fetch();
    if (!$existente) {
        http_response_code(404);
        echo json_encode(['ok' => false, 'message' => 'Registro no encontrado.']);
        exit;
    }

    $titulo = trim($body['titulo'] ?? $existente['titulo']);
    if ($titulo === '') {
        http_response_code(400);
        echo json_encode(['ok' => false, 'message' => 'El titulo es requerido.']);
        exit;
    }

    $item = [
        'id' => $id,
        'titulo' => $titulo,
        'descripcion' => $body['descripcion'] ?? $existente['descripcion'],
        'archivo_url' => isset($body['archivo_url']) && $body['archivo_url'] !== '' ? $body['archivo_url'] : $existente['archivo_url'],
        'archivo_tipo' => in_array($body['archivo_tipo'] ?? '', ['pdf', 'imagen'], true) ? $body['archivo_tipo'] : $existente['archivo_tipo']
    ];

    $stmt = $pdo->prepare('UPDATE acreditaciones SET titulo = :titulo, descripcion = :descripcion, archivo_url = :archivo_url, archivo_tipo = :archivo_tipo WHERE id = :id');
    $stmt->execute($item);

    echo json_encode(['ok' => true, 'acreditacion' => array_merge($existente, $item)]);
    exit;
}

if ($method === 'DELETE') {
    $stmt = $pdo->prepare('DELETE FROM acreditaciones WHERE id = :id');
    $stmt->execute(['id' => $id]);
    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['ok' => false, 'message' => 'Registro no encontrado.']);
        exit;
    }
    echo json_encode(['ok' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['ok' => false, 'message' => 'Metodo no permitido.']);
