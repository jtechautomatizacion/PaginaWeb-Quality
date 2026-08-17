<?php

require_once __DIR__ . '/conexion.php';
require_once __DIR__ . '/crud_factory.php';

$slug = $_GET['slug'] ?? null;

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $slug) {
    $stmt = $pdo->prepare("SELECT * FROM docentes WHERE slug = :slug");
    $stmt->execute(['slug' => $slug]);
    $docente = $stmt->fetch();

    if (!$docente) {
        http_response_code(404);
        echo json_encode(['error' => 'Docente no encontrado']);
        exit;
    }

    $cursosStmt = $pdo->prepare("SELECT id, titulo, slug FROM cursos WHERE docente_id = :id AND estado = 'published' ORDER BY fecha DESC");
    $cursosStmt->execute(['id' => $docente['id']]);
    $cursos = $cursosStmt->fetchAll();

    echo json_encode([
        'nombre' => $docente['titulo'],
        'role' => $docente['role'] ?? '',
        'bio' => $docente['bio'] ?? '',
        'photo' => $docente['imagen'] ?? '',
        'linkedin' => $docente['linkedin'] ?? '',
        'cursos' => $cursos
    ]);
    exit;
}

handleCollection($pdo, 'docentes', 'docente', 'https://placehold.co/250x250/D4E3F0/D4E3F0', function ($body, $existente) {
    return [
        'role' => $body['role'] ?? ($existente['role'] ?? ''),
        'bio' => $body['bio'] ?? ($existente['bio'] ?? ''),
        'linkedin' => $body['linkedin'] ?? ($existente['linkedin'] ?? '')
    ];
});
