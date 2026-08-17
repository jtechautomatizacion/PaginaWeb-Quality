<?php

require_once __DIR__ . '/conexion.php';
require_once __DIR__ . '/crud_factory.php';

header('Content-Type: text/plain; charset=utf-8');

try {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS docentes (
            id BIGINT PRIMARY KEY,
            titulo VARCHAR(255) NOT NULL,
            slug VARCHAR(255) NOT NULL UNIQUE,
            resumen TEXT,
            imagen VARCHAR(512),
            estado VARCHAR(20) DEFAULT 'published',
            fecha VARCHAR(20),
            timestamp BIGINT,
            role VARCHAR(255),
            bio TEXT,
            linkedin VARCHAR(512)
        )
    ");
    echo "OK tabla docentes lista\n";
} catch (Exception $e) {
    echo "ERROR creando tabla docentes: " . $e->getMessage() . "\n";
    exit;
}

try {
    $pdo->exec("ALTER TABLE cursos ADD COLUMN docente_id BIGINT NULL AFTER docente");
    echo "OK columna docente_id agregada a cursos\n";
} catch (Exception $e) {
    echo "docente_id ya existia o error: " . $e->getMessage() . "\n";
}

$stmt = $pdo->query("
    SELECT DISTINCT docente, docente_role, docente_bio, docente_photo, docente_linkedin
    FROM cursos
    WHERE docente IS NOT NULL AND TRIM(docente) <> ''
");
$distintos = $stmt->fetchAll();

$creados = 0;
$reutilizados = 0;

foreach ($distintos as $d) {
    $nombre = trim($d['docente']);
    $slug = slugify($nombre);

    $check = $pdo->prepare("SELECT id FROM docentes WHERE slug = :slug");
    $check->execute(['slug' => $slug]);
    $existente = $check->fetch();

    if ($existente) {
        $docenteId = $existente['id'];
        $reutilizados++;
    } else {
        $timestamp = (int) round(microtime(true) * 1000) + $creados;
        $docenteId = $timestamp;
        $insert = $pdo->prepare("
            INSERT INTO docentes (id, titulo, slug, resumen, imagen, estado, fecha, timestamp, role, bio, linkedin)
            VALUES (:id, :titulo, :slug, :resumen, :imagen, 'published', :fecha, :timestamp, :role, :bio, :linkedin)
        ");
        $insert->execute([
            'id' => $docenteId,
            'titulo' => $nombre,
            'slug' => $slug,
            'resumen' => $d['docente_role'] ?? '',
            'imagen' => $d['docente_photo'] ?: 'https://placehold.co/250x250/D4E3F0/D4E3F0',
            'fecha' => todayDisplay(),
            'timestamp' => $timestamp,
            'role' => $d['docente_role'] ?? '',
            'bio' => $d['docente_bio'] ?? '',
            'linkedin' => $d['docente_linkedin'] ?? ''
        ]);
        $creados++;
    }

    $update = $pdo->prepare("UPDATE cursos SET docente_id = :docente_id WHERE TRIM(docente) = :docente");
    $update->execute(['docente_id' => $docenteId, 'docente' => $nombre]);
}

echo "OK docentes creados: {$creados}, reutilizados: {$reutilizados}\n";
echo "Migracion completa. Columnas antiguas (docente, docente_role, docente_bio, docente_photo, docente_linkedin) se conservan en cursos por seguridad, ya no se usan para escritura.\n";
