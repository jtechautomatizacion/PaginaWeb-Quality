CREATE DATABASE IF NOT EXISTS group_tqc CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE group_tqc;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO usuarios (usuario, contrasena) VALUES ('admin', 'admin');

CREATE TABLE servicios (
    id BIGINT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    resumen TEXT,
    imagen VARCHAR(500),
    estado ENUM('published', 'draft') NOT NULL DEFAULT 'published',
    fecha VARCHAR(20),
    timestamp BIGINT NOT NULL,
    INDEX idx_servicios_slug (slug),
    INDEX idx_servicios_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE investigacion (
    id BIGINT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    resumen TEXT,
    imagen VARCHAR(500),
    estado ENUM('published', 'draft') NOT NULL DEFAULT 'published',
    fecha VARCHAR(20),
    timestamp BIGINT NOT NULL,
    INDEX idx_investigacion_slug (slug),
    INDEX idx_investigacion_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE cursos (
    id BIGINT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    resumen TEXT,
    imagen VARCHAR(500),
    estado ENUM('published', 'draft') NOT NULL DEFAULT 'published',
    fecha VARCHAR(20),
    timestamp BIGINT NOT NULL,
    INDEX idx_cursos_slug (slug),
    INDEX idx_cursos_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE proyectos (
    id BIGINT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    resumen TEXT,
    imagen VARCHAR(500),
    estado ENUM('published', 'draft') NOT NULL DEFAULT 'published',
    ubicacion VARCHAR(255),
    fecha VARCHAR(60),
    fecha_admin VARCHAR(20),
    timestamp BIGINT NOT NULL,
    INDEX idx_proyectos_slug (slug),
    INDEX idx_proyectos_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
