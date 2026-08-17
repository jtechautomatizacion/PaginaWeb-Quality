<?php
require_once __DIR__ . '/conexion.php';

try {
    $pdo->exec("ALTER TABLE usuarios ADD COLUMN contrasena_changed INT DEFAULT 0");
    echo "✓ Columna contrasena_changed agregada\n";
} catch (Exception $e) {
    echo "Info: " . $e->getMessage() . "\n";
}

try {
    $pdo->exec("UPDATE usuarios SET contrasena_changed = 1");
    echo "✓ Usuarios existentes marcados como contraseña ya cambiada\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
