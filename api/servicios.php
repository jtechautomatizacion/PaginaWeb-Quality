<?php

require_once __DIR__ . '/conexion.php';
require_once __DIR__ . '/crud_factory.php';

handleCollection($pdo, 'servicios', 'servicio', 'https://placehold.co/640x480/e9edf5/e9edf5', function ($body, $existente) {
    return [
        'contenido' => $body['contenido'] ?? ($existente['contenido'] ?? null),
        'incluye' => isset($body['incluye']) ? json_encode($body['incluye']) : ($existente['incluye'] ?? '[]'),
        'galeria' => isset($body['galeria']) ? json_encode($body['galeria']) : ($existente['galeria'] ?? '[]'),
        'intro_imagen' => $body['intro_imagen'] ?? ($existente['intro_imagen'] ?? ''),
        'destacado' => isset($body['destacado']) ? (int) !!$body['destacado'] : (int) ($existente['destacado'] ?? 0)
    ];
});
