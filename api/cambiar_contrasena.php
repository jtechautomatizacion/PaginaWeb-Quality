<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/conexion.php';

$body = json_decode(file_get_contents('php://input'), true);
if (!is_array($body)) {
    $body = [];
}

$username = trim($body['username'] ?? '');
$old_password = (string) ($body['old_password'] ?? '');
$new_password = (string) ($body['new_password'] ?? '');

if ($username === '' || $old_password === '' || $new_password === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Todos los campos son requeridos.']);
    exit;
}

if (strlen($new_password) < 6) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'La nueva contraseña debe tener al menos 6 caracteres.']);
    exit;
}

$stmt = $pdo->prepare('SELECT id FROM usuarios WHERE usuario = :usuario AND contrasena = :contrasena');
$stmt->execute(['usuario' => $username, 'contrasena' => $old_password]);
$usuario = $stmt->fetch();

if (!$usuario) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'message' => 'Usuario o contraseña actual incorrectos.']);
    exit;
}

$update = $pdo->prepare('UPDATE usuarios SET contrasena = :nueva, contrasena_changed = 1 WHERE id = :id');
$update->execute(['nueva' => $new_password, 'id' => $usuario['id']]);

echo json_encode(['ok' => true, 'message' => 'Contraseña actualizada correctamente.', 'redirect' => 'admin.html']);
