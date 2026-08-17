<?php
require_once __DIR__ . '/conexion.php';

try {
    $stmt = $pdo->query("SHOW COLUMNS FROM servicios LIKE 'contenido'");
    $exists = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$exists) {
        $pdo->exec("ALTER TABLE servicios ADD COLUMN contenido TEXT NULL AFTER resumen");
        echo json_encode(['ok' => true, 'msg' => 'Columna contenido agregada']);
    } else {
        echo json_encode(['ok' => true, 'msg' => 'Columna contenido ya existe']);
    }
} catch (Exception $e) {
    echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
}
