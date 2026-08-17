<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/conexion.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $rows = $pdo->query('SELECT clave, valor FROM contenido_sitio')->fetchAll();
    $result = [];
    foreach ($rows as $row) {
        $result[$row['clave']] = $row['valor'];
    }
    echo json_encode($result);
    exit;
}

if ($method === 'PUT') {
    $body = json_decode(file_get_contents('php://input'), true);
    if (!is_array($body)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'message' => 'Datos invalidos.']);
        exit;
    }

    $stmt = $pdo->prepare('INSERT INTO contenido_sitio (clave, valor) VALUES (:clave, :valor) ON DUPLICATE KEY UPDATE valor = :valor2');
    foreach ($body as $clave => $valor) {
        $stmt->execute(['clave' => (string) $clave, 'valor' => (string) $valor, 'valor2' => (string) $valor]);
    }

    echo json_encode(['ok' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['ok' => false, 'message' => 'Metodo no permitido.']);
