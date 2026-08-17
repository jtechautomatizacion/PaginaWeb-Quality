<?php

require_once __DIR__ . '/conexion.php';
require_once __DIR__ . '/crud_factory.php';

handleCollection($pdo, 'proyectos', 'proyecto', 'https://placehold.co/600x400/e9edf5/e9edf5', function ($body, $existente) {
    return [
        'ubicacion' => $body['ubicacion'] ?? ($existente['ubicacion'] ?? ''),
        'fecha' => !empty($body['fecha']) ? $body['fecha'] : ($existente['fecha'] ?? ('Ejecutado en ' . date('Y'))),
        'fecha_admin' => todayDisplay(),
        'categoria' => $body['categoria'] ?? ($existente['categoria'] ?? ''),
        'empresa' => $body['empresa'] ?? ($existente['empresa'] ?? ''),
        'contenido' => $body['contenido'] ?? ($existente['contenido'] ?? '')
    ];
});
