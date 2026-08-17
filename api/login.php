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

$ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
$lockfile = __DIR__ . '/../.login_attempts_' . md5($ip) . '.json';
$max_attempts = 5;
$lockout_minutes = 15;

function checkRateLimit($lockfile, $max_attempts, $lockout_minutes) {
    if (file_exists($lockfile)) {
        $data = json_decode(file_get_contents($lockfile), true);
        $elapsed = time() - $data['timestamp'];
        if ($elapsed < $lockout_minutes * 60) {
            if ($data['count'] >= $max_attempts) {
                return ['blocked' => true, 'remaining' => $lockout_minutes * 60 - $elapsed];
            }
        } else {
            unlink($lockfile);
            return ['blocked' => false];
        }
    }
    return ['blocked' => false];
}

function recordFailedAttempt($lockfile) {
    $data = ['count' => 1, 'timestamp' => time()];
    if (file_exists($lockfile)) {
        $existing = json_decode(file_get_contents($lockfile), true);
        if (time() - $existing['timestamp'] < 15 * 60) {
            $data['count'] = $existing['count'] + 1;
        }
    }
    file_put_contents($lockfile, json_encode($data));
}

function clearAttempts($lockfile) {
    if (file_exists($lockfile)) unlink($lockfile);
}

$limit_check = checkRateLimit($lockfile, $max_attempts, $lockout_minutes);
if ($limit_check['blocked']) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'message' => 'Demasiados intentos fallidos. Intenta de nuevo en ' . ceil($limit_check['remaining'] / 60) . ' minuto(s).']);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
if (!is_array($body)) {
    $body = [];
}

$username = trim($body['username'] ?? '');
$password = (string) ($body['password'] ?? '');

if ($username === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Usuario y contrasena son requeridos.']);
    exit;
}

$stmt = $pdo->prepare('SELECT id, contrasena_changed FROM usuarios WHERE usuario = :usuario AND contrasena = :contrasena');
$stmt->execute(['usuario' => $username, 'contrasena' => $password]);
$usuario = $stmt->fetch();

if (!$usuario) {
    recordFailedAttempt($lockfile);
    http_response_code(401);
    echo json_encode(['ok' => false, 'message' => 'Usuario o contrasena incorrectos.']);
    exit;
}

clearAttempts($lockfile);

$redirect = 'admin.html';
$force_change = false;

if (empty($usuario['contrasena_changed'])) {
    $redirect = 'cambiar_contrasena.html';
    $force_change = true;
}

echo json_encode(['ok' => true, 'redirect' => $redirect, 'force_change_password' => $force_change]);
