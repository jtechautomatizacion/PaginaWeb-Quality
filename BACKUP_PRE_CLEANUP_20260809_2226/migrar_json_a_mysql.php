<?php

require_once __DIR__ . '/conexion.php';

header('Content-Type: application/json; charset=utf-8');

$ROOT = dirname(__DIR__);

function leerJson($ruta) {
    if (!file_exists($ruta)) {
        return [];
    }
    $data = json_decode(file_get_contents($ruta), true);
    return is_array($data) ? $data : [];
}

function migrarSimple(PDO $pdo, $tabla, $items) {
    $sql = "INSERT INTO `{$tabla}` (`id`, `titulo`, `slug`, `resumen`, `imagen`, `estado`, `fecha`, `timestamp`)
            VALUES (:id, :titulo, :slug, :resumen, :imagen, :estado, :fecha, :timestamp)
            ON DUPLICATE KEY UPDATE
                `titulo` = VALUES(`titulo`),
                `slug` = VALUES(`slug`),
                `resumen` = VALUES(`resumen`),
                `imagen` = VALUES(`imagen`),
                `estado` = VALUES(`estado`),
                `fecha` = VALUES(`fecha`),
                `timestamp` = VALUES(`timestamp`)";
    $stmt = $pdo->prepare($sql);

    $count = 0;
    foreach ($items as $item) {
        $stmt->execute([
            'id' => $item['id'] ?? null,
            'titulo' => $item['titulo'] ?? '',
            'slug' => $item['slug'] ?? '',
            'resumen' => $item['resumen'] ?? '',
            'imagen' => $item['imagen'] ?? '',
            'estado' => $item['estado'] ?? 'published',
            'fecha' => $item['fecha'] ?? '',
            'timestamp' => $item['timestamp'] ?? 0
        ]);
        $count++;
    }
    return $count;
}

function migrarProyectos(PDO $pdo, $items) {
    $sql = "INSERT INTO `proyectos` (`id`, `titulo`, `slug`, `resumen`, `imagen`, `ubicacion`, `fecha`, `estado`, `fecha_admin`, `timestamp`)
            VALUES (:id, :titulo, :slug, :resumen, :imagen, :ubicacion, :fecha, :estado, :fecha_admin, :timestamp)
            ON DUPLICATE KEY UPDATE
                `titulo` = VALUES(`titulo`),
                `slug` = VALUES(`slug`),
                `resumen` = VALUES(`resumen`),
                `imagen` = VALUES(`imagen`),
                `ubicacion` = VALUES(`ubicacion`),
                `fecha` = VALUES(`fecha`),
                `estado` = VALUES(`estado`),
                `fecha_admin` = VALUES(`fecha_admin`),
                `timestamp` = VALUES(`timestamp`)";
    $stmt = $pdo->prepare($sql);

    $count = 0;
    foreach ($items as $item) {
        $stmt->execute([
            'id' => $item['id'] ?? null,
            'titulo' => $item['titulo'] ?? '',
            'slug' => $item['slug'] ?? '',
            'resumen' => $item['resumen'] ?? '',
            'imagen' => $item['imagen'] ?? '',
            'ubicacion' => $item['ubicacion'] ?? '',
            'fecha' => $item['fecha'] ?? '',
            'estado' => $item['estado'] ?? 'published',
            'fecha_admin' => $item['fecha_admin'] ?? '',
            'timestamp' => $item['timestamp'] ?? 0
        ]);
        $count++;
    }
    return $count;
}

$resultado = [];

try {
    $pdo->beginTransaction();

    $resultado['servicios'] = migrarSimple($pdo, 'servicios', leerJson($ROOT . '/servicios.json'));
    $resultado['proyectos'] = migrarProyectos($pdo, leerJson($ROOT . '/proyectos.json'));
    $resultado['investigacion'] = migrarSimple($pdo, 'investigacion', leerJson($ROOT . '/investigacion.json'));
    $resultado['cursos'] = migrarSimple($pdo, 'cursos', leerJson($ROOT . '/cursos.json'));

    $pdo->commit();
    echo json_encode(['ok' => true, 'migrados' => $resultado]);
} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => $e->getMessage()]);
}
