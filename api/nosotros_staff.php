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
    $stmt = $pdo->query('SELECT * FROM nosotros_staff ORDER BY orden ASC');
    echo json_encode($stmt->fetchAll());
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
if (!is_array($body)) {
    $body = [];
}

if ($method === 'POST') {
    $nombre = trim($body['nombre'] ?? '');
    $cargo = trim($body['cargo'] ?? '');
    if ($nombre === '' || $cargo === '') {
        http_response_code(400);
        echo json_encode(['ok' => false, 'message' => 'El nombre y el cargo son requeridos.']);
        exit;
    }

    $timestamp = (int) round(microtime(true) * 1000);
    $maxOrden = (int) $pdo->query('SELECT COALESCE(MAX(orden), 0) FROM nosotros_staff')->fetchColumn();

    $item = [
        'id' => $timestamp,
        'nombre' => $nombre,
        'cargo' => $cargo,
        'descripcion' => $body['descripcion'] ?? '',
        'imagen' => $body['imagen'] ?? '',
        'orden' => $maxOrden + 1,
        'timestamp' => $timestamp
    ];

    $stmt = $pdo->prepare('INSERT INTO nosotros_staff (id, nombre, cargo, descripcion, imagen, orden, timestamp) VALUES (:id, :nombre, :cargo, :descripcion, :imagen, :orden, :timestamp)');
    $stmt->execute($item);

    http_response_code(201);
    echo json_encode(['ok' => true, 'staff' => $item]);
    exit;
}

$id = $_GET['id'] ?? null;
if (!$id) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'ID requerido.']);
    exit;
}

if ($method === 'PUT') {
    $stmt = $pdo->prepare('SELECT * FROM nosotros_staff WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $existente = $stmt->fetch();
    if (!$existente) {
        http_response_code(404);
        echo json_encode(['ok' => false, 'message' => 'Registro no encontrado.']);
        exit;
    }

    $nombre = trim($body['nombre'] ?? $existente['nombre']);
    $cargo = trim($body['cargo'] ?? $existente['cargo']);
    if ($nombre === '' || $cargo === '') {
        http_response_code(400);
        echo json_encode(['ok' => false, 'message' => 'El nombre y el cargo son requeridos.']);
        exit;
    }

    $item = [
        'id' => $id,
        'nombre' => $nombre,
        'cargo' => $cargo,
        'descripcion' => $body['descripcion'] ?? $existente['descripcion'],
        'imagen' => !empty($body['imagen']) ? $body['imagen'] : $existente['imagen']
    ];

    $stmt = $pdo->prepare('UPDATE nosotros_staff SET nombre = :nombre, cargo = :cargo, descripcion = :descripcion, imagen = :imagen WHERE id = :id');
    $stmt->execute($item);

    echo json_encode(['ok' => true, 'staff' => array_merge($existente, $item)]);
    exit;
}

if ($method === 'DELETE') {
    $stmt = $pdo->prepare('SELECT imagen FROM nosotros_staff WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $existente = $stmt->fetch();
    if (!$existente) {
        http_response_code(404);
        echo json_encode(['ok' => false, 'message' => 'Registro no encontrado.']);
        exit;
    }

    $stmt = $pdo->prepare('DELETE FROM nosotros_staff WHERE id = :id');
    $stmt->execute(['id' => $id]);

    $imagen = $existente['imagen'];
    if ($imagen && strpos($imagen, 'assets/uploads/') === 0) {
        $rutaImagen = realpath(__DIR__ . '/../' . $imagen);
        $uploadsRootReal = realpath(__DIR__ . '/../assets/uploads');
        if ($rutaImagen && $uploadsRootReal && strpos($rutaImagen, $uploadsRootReal) === 0 && is_file($rutaImagen)) {
            @unlink($rutaImagen);
        }
    }

    echo json_encode(['ok' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['ok' => false, 'message' => 'Metodo no permitido.']);
