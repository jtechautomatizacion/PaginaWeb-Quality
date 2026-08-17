<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/conexion.php';

$tipo = $_GET['tipo'] ?? 'overview';

if ($tipo === 'overview') {
    $colecciones = ['servicios', 'proyectos', 'investigacion', 'cursos'];
    $resumen = [];

    foreach ($colecciones as $col) {
        $stmt = $pdo->prepare("SELECT COUNT(*) as total, SUM(CASE WHEN estado='draft' THEN 1 ELSE 0 END) as borradores FROM `$col`");
        $stmt->execute();
        $data = $stmt->fetch();
        $resumen[$col] = [
            'total' => (int)$data['total'],
            'publicados' => (int)$data['total'] - (int)($data['borradores'] ?? 0),
            'borradores' => (int)($data['borradores'] ?? 0)
        ];
    }

    echo json_encode(['ok' => true, 'data' => $resumen]);
    exit;
}

if ($tipo === 'drafts') {
    $result = [];

    $colecciones = ['servicios', 'proyectos', 'investigacion', 'cursos'];
    foreach ($colecciones as $col) {
        $stmt = $pdo->prepare("SELECT id, titulo, slug, fecha FROM `$col` WHERE estado='draft' ORDER BY timestamp DESC");
        $stmt->execute();
        $result[$col] = $stmt->fetchAll();
    }

    echo json_encode(['ok' => true, 'data' => $result]);
    exit;
}

if ($tipo === 'cursos-sin-docente') {
    $stmt = $pdo->prepare("SELECT id, titulo, slug, fecha FROM cursos WHERE docente_id IS NULL AND estado='published' ORDER BY timestamp DESC");
    $stmt->execute();
    $result = $stmt->fetchAll();

    echo json_encode(['ok' => true, 'data' => $result]);
    exit;
}

if ($tipo === 'docentes-sin-cursos') {
    $stmt = $pdo->prepare("SELECT d.id, d.titulo, d.slug, COUNT(c.id) as cursos FROM docentes d LEFT JOIN cursos c ON c.docente_id=d.id AND c.estado='published' WHERE d.estado='published' GROUP BY d.id HAVING COUNT(c.id)=0");
    $stmt->execute();
    $result = $stmt->fetchAll();

    echo json_encode(['ok' => true, 'data' => $result]);
    exit;
}

http_response_code(400);
echo json_encode(['ok' => false, 'message' => 'Tipo de reporte inválido.']);
