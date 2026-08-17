<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$ACCENT_MAP = [
    'a' => ['á', 'à', 'ä', 'â'],
    'e' => ['é', 'è', 'ë', 'ê'],
    'i' => ['í', 'ì', 'ï', 'î'],
    'o' => ['ó', 'ò', 'ö', 'ô'],
    'u' => ['ú', 'ù', 'ü', 'û'],
    'n' => ['ñ']
];

function slugify($text) {
    global $ACCENT_MAP;
    $result = mb_strtolower((string) $text, 'UTF-8');
    foreach ($ACCENT_MAP as $plain => $accented) {
        foreach ($accented as $a) {
            $result = str_replace($a, $plain, $result);
        }
    }
    $result = preg_replace('/[^a-z0-9]+/', '-', $result);
    return trim($result, '-');
}

function todayDisplay() {
    return date('d/m/Y');
}

function handleCollection(PDO $pdo, $table, $itemName, $defaultImagen, $buildItem = null) {
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM `{$table}` ORDER BY timestamp DESC");
        echo json_encode($stmt->fetchAll());
        return;
    }

    $body = json_decode(file_get_contents('php://input'), true);
    if (!is_array($body)) {
        $body = [];
    }

    if ($method === 'POST') {
        $titulo = trim($body['titulo'] ?? '');
        if ($titulo === '') {
            http_response_code(400);
            echo json_encode(['ok' => false, 'message' => 'El titulo es requerido.']);
            return;
        }

        $timestamp = (int) round(microtime(true) * 1000);
        $item = [
            'id' => $timestamp,
            'titulo' => $titulo,
            'slug' => slugify($titulo),
            'resumen' => $body['resumen'] ?? '',
            'imagen' => !empty($body['imagen']) ? $body['imagen'] : $defaultImagen,
            'estado' => ($body['estado'] ?? '') === 'draft' ? 'draft' : 'published',
            'fecha' => todayDisplay(),
            'timestamp' => $timestamp
        ];
        if ($buildItem) {
            $item = array_merge($item, $buildItem($body, null));
        }

        $columns = array_keys($item);
        $placeholders = array_map(function ($c) { return ":{$c}"; }, $columns);
        $sql = "INSERT INTO `{$table}` (`" . implode('`, `', $columns) . "`) VALUES (" . implode(', ', $placeholders) . ")";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($item);

        http_response_code(201);
        echo json_encode(['ok' => true, $itemName => $item]);
        return;
    }

    $id = $_GET['id'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'message' => 'ID requerido.']);
        return;
    }

    if ($method === 'PUT') {
        $titulo = trim($body['titulo'] ?? '');
        if ($titulo === '') {
            http_response_code(400);
            echo json_encode(['ok' => false, 'message' => 'El titulo es requerido.']);
            return;
        }

        $stmt = $pdo->prepare("SELECT * FROM `{$table}` WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $existente = $stmt->fetch();
        if (!$existente) {
            http_response_code(404);
            echo json_encode(['ok' => false, 'message' => 'Registro no encontrado.']);
            return;
        }

        $item = array_merge($existente, [
            'titulo' => $titulo,
            'slug' => slugify($titulo),
            'resumen' => $body['resumen'] ?? '',
            'imagen' => !empty($body['imagen']) ? $body['imagen'] : $existente['imagen'],
            'fecha' => !empty($body['fecha']) ? $body['fecha'] : $existente['fecha']
        ]);
        if ($buildItem) {
            $item = array_merge($item, $buildItem($body, $existente));
        }

        $columns = array_keys($item);
        $assignments = array_map(function ($c) { return "`{$c}` = :{$c}"; }, array_values(array_diff($columns, ['id'])));
        $sql = "UPDATE `{$table}` SET " . implode(', ', $assignments) . " WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($item);

        echo json_encode(['ok' => true, $itemName => $item]);
        return;
    }

    if ($method === 'DELETE') {
        $stmt = $pdo->prepare("DELETE FROM `{$table}` WHERE id = :id");
        $stmt->execute(['id' => $id]);
        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['ok' => false, 'message' => 'Registro no encontrado.']);
            return;
        }
        echo json_encode(['ok' => true]);
        return;
    }

    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Metodo no permitido.']);
}
