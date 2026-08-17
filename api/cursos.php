<?php

require_once __DIR__ . '/conexion.php';
require_once __DIR__ . '/crud_factory.php';

handleCollection($pdo, 'cursos', 'curso', 'https://placehold.co/84x56/eceff4/eceff4', function ($body, $existente) {
    return [
        'modalidad' => $body['modalidad'] ?? ($existente['modalidad'] ?? ''),
        'duracion' => $body['duracion'] ?? ($existente['duracion'] ?? ''),
        'nivel' => $body['nivel'] ?? ($existente['nivel'] ?? ''),
        'inversion' => $body['inversion'] ?? ($existente['inversion'] ?? ''),
        'docente_id' => !empty($body['docente_id']) ? $body['docente_id'] : ($existente['docente_id'] ?? null),
        'contenido' => $body['contenido'] ?? ($existente['contenido'] ?? '')
    ];
});
