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

$MAX_VALORES = 6;
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT * FROM nosotros_valores ORDER BY orden ASC');
    echo json_encode($stmt->fetchAll());
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
if (!is_array($body)) {
    $body = [];
}

if ($method === 'POST') {
    $nombre = trim($body['nombre'] ?? '');
    $iconoFa = trim($body['icono_fa'] ?? '');
    if ($nombre === '' || $iconoFa === '') {
        http_response_code(400);
        echo json_encode(['ok' => false, 'message' => 'El nombre y el icono son requeridos.']);
        exit;
    }

    $total = (int) $pdo->query('SELECT COUNT(*) FROM nosotros_valores')->fetchColumn();
    if ($total >= $MAX_VALORES) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'message' => 'Ya alcanzaste el limite de ' . $MAX_VALORES . ' valores. Elimina alguno antes de agregar otro.']);
        exit;
    }

    $timestamp = (int) round(microtime(true) * 1000);
    $maxOrden = (int) $pdo->query('SELECT COALESCE(MAX(orden), 0) FROM nosotros_valores')->fetchColumn();

    $item = [
        'id' => $timestamp,
        'nombre' => $nombre,
        'icono_fa' => $iconoFa,
        'orden' => $maxOrden + 1,
        'timestamp' => $timestamp
    ];

    $stmt = $pdo->prepare('INSERT INTO nosotros_valores (id, nombre, icono_fa, orden, timestamp) VALUES (:id, :nombre, :icono_fa, :orden, :timestamp)');
    $stmt->execute($item);

    http_response_code(201);
    echo json_encode(['ok' => true, 'valor' => $item]);
    exit;
}

$id = $_GET['id'] ?? null;
if (!$id) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'ID requerido.']);
    exit;
}

if ($method === 'PUT') {
    $stmt = $pdo->prepare('SELECT * FROM nosotros_valores WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $existente = $stmt->fetch();
    if (!$existente) {
        http_response_code(404);
        echo json_encode(['ok' => false, 'message' => 'Registro no encontrado.']);
        exit;
    }

    $nombre = trim($body['nombre'] ?? $existente['nombre']);
    $iconoFa = trim($body['icono_fa'] ?? $existente['icono_fa']);
    if ($nombre === '' || $iconoFa === '') {
        http_response_code(400);
        echo json_encode(['ok' => false, 'message' => 'El nombre y el icono son requeridos.']);
        exit;
    }

    $item = [
        'id' => $id,
        'nombre' => $nombre,
        'icono_fa' => $iconoFa
    ];

    $stmt = $pdo->prepare('UPDATE nosotros_valores SET nombre = :nombre, icono_fa = :icono_fa WHERE id = :id');
    $stmt->execute($item);

    echo json_encode(['ok' => true, 'valor' => array_merge($existente, $item)]);
    exit;
}

if ($method === 'DELETE') {
    $stmt = $pdo->prepare('DELETE FROM nosotros_valores WHERE id = :id');
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
