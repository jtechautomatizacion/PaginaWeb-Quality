<?php

require_once __DIR__ . '/conexion.php';

try {
    $pdo->exec("ALTER TABLE cursos ADD COLUMN docente_role VARCHAR(255) AFTER docente");
    echo "✓ docente_role added\n";
} catch (Exception $e) {
    echo "docente_role: " . $e->getMessage() . "\n";
}

try {
    $pdo->exec("ALTER TABLE cursos ADD COLUMN docente_bio TEXT AFTER docente_role");
    echo "✓ docente_bio added\n";
} catch (Exception $e) {
    echo "docente_bio: " . $e->getMessage() . "\n";
}

try {
    $pdo->exec("ALTER TABLE cursos ADD COLUMN docente_photo VARCHAR(512) AFTER docente_bio");
    echo "✓ docente_photo added\n";
} catch (Exception $e) {
    echo "docente_photo: " . $e->getMessage() . "\n";
}

try {
    $pdo->exec("ALTER TABLE cursos ADD COLUMN docente_linkedin VARCHAR(512) AFTER docente_photo");
    echo "✓ docente_linkedin added\n";
} catch (Exception $e) {
    echo "docente_linkedin: " . $e->getMessage() . "\n";
}

$updates = [
    [
        'nombre' => 'Ing. Eduardo Vidaud Quintana',
        'role' => 'Patología y Diagnóstico Estructural',
        'bio' => 'Ingeniero Civil con Maestría en Ingeniería Estructural por la UNAM (México). Consultor técnico del Instituto Mexicano del Cemento y del Concreto (IMCYC), miembro activo del ACI y exmiembro de la junta directiva de la Sociedad Mexicana de Ingeniería Estructural (SMIE). Certificado en Ensayos No Destructivos (NDT) por Germann Instruments.',
        'photo' => 'assets/staff/staff-eduardo-vidaud.jpeg',
        'linkedin' => ''
    ],
    [
        'nombre' => 'Ing. Rosendo Jose Antonio Soruco Zegada',
        'role' => 'Pavimentos, Geotecnia y Tecnología del Hormigón',
        'bio' => 'Consultor internacional con operaciones en Perú y Bolivia. Dirección técnica en diseño, construcción y rehabilitación de pavimentos para infraestructuras carreteras y aeroportuarias. Garantía de solvencia técnica y estricto cumplimiento normativo en obras de alta exigencia.',
        'photo' => 'assets/staff/staff-jose-soruco.jpeg',
        'linkedin' => ''
    ],
    [
        'nombre' => 'Ing. Jesus Angel Huaman Chavez',
        'role' => 'Tecnología del Concreto | RENACYT | Certificado ACI',
        'bio' => 'Ingeniero Civil de la Universidad Continental, Gerente General de Group Total Quality Control. Investigador RENACYT Nivel VII con certificaciones ACI (Concrete Laboratory + Aggregate + Strength Testing), INECYC y CIP 356132. Especialista en tecnología del concreto, mecánica de suelos y patología estructural.',
        'photo' => 'assets/staff/staff-jesus-huaman.jpeg',
        'linkedin' => ''
    ]
];

foreach ($updates as $u) {
    $stmt = $pdo->prepare("UPDATE cursos SET docente_role = :role, docente_bio = :bio, docente_photo = :photo, docente_linkedin = :linkedin WHERE LOWER(docente) = LOWER(:nombre)");
    $stmt->execute([
        'nombre' => $u['nombre'],
        'role' => $u['role'],
        'bio' => $u['bio'],
        'photo' => $u['photo'],
        'linkedin' => $u['linkedin']
    ]);
    echo "✓ Updated {$u['nombre']}\n";
}

echo "Migration complete!\n";
