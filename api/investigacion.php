<?php

require_once __DIR__ . '/conexion.php';
require_once __DIR__ . '/crud_factory.php';

handleCollection($pdo, 'investigacion', 'articulo', 'https://placehold.co/84x56/eceff4/eceff4', function ($body, $existente) {
    return [
        'contenido' => $body['contenido'] ?? ($existente['contenido'] ?? ''),
        'docente' => $body['docente'] ?? ($existente['docente'] ?? '')
    ];
});
