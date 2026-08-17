-- Migracion: numeros de la seccion Trayectoria en Nosotros (distinta de la tabla estadisticas usada en Inicio)
-- Ejecutar una sola vez: mysql -u root group_tqc < api/migracion_nosotros_trayectoria.sql

CREATE TABLE IF NOT EXISTS nosotros_trayectoria (
  id BIGINT PRIMARY KEY,
  numero VARCHAR(20) NOT NULL,
  sufijo VARCHAR(20) DEFAULT '',
  etiqueta VARCHAR(150) NOT NULL,
  enlace_texto VARCHAR(100) DEFAULT '',
  enlace_url VARCHAR(255) DEFAULT '',
  orden INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO nosotros_trayectoria (id, numero, sufijo, etiqueta, enlace_texto, enlace_url, orden) VALUES
(1700000000201, '3', 'AÑOS', 'de experiencia técnica', '', '', 1),
(1700000000202, '35', '', 'Proyectos a nivel nacional', 'Ver más proyectos', 'proyectos_publico.html', 2),
(1700000000203, '50', '', 'Tipos de ensayos normados', '', '', 3);
