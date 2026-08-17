-- Migracion: dinamiza la seccion "Nosotros"
-- Ejecutar una sola vez: mysql -u root group_tqc < api/migracion_nosotros.sql

CREATE TABLE IF NOT EXISTS nosotros_bloques (
  clave VARCHAR(40) PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL DEFAULT '',
  contenido LONGTEXT,
  imagen VARCHAR(255) DEFAULT '',
  orden INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS nosotros_valores (
  id BIGINT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  icono_fa VARCHAR(50) NOT NULL DEFAULT 'fas fa-star',
  orden INT DEFAULT 0,
  timestamp BIGINT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS nosotros_staff (
  id BIGINT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  cargo VARCHAR(200) NOT NULL,
  descripcion TEXT,
  imagen VARCHAR(255) DEFAULT '',
  orden INT DEFAULT 0,
  timestamp BIGINT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO nosotros_bloques (clave, titulo, contenido, imagen, orden) VALUES
('slide1', '¿Quiénes somos?', 'Group Total Quality Control S.A.C. es una firma peruana de ingeniería especializada en el aseguramiento y control de calidad (QA/QC) integral para proyectos de infraestructura vial, edificación comercial, saneamiento y minería.<br>\nAvalados por la acreditación del Instituto Nacional de Calidad (INACAL) bajo la norma NTP-ISO/IEC 17025:2017 y un sólido sistema de gestión certificado en ISO 9001, ISO 14001, ISO 45001 e ISO 37001, nos posicionamos como el socio estratégico que certifica la viabilidad, seguridad estructural y durabilidad operativa de las obras más exigentes.', 'assets/quienes-somos.jpeg', 1),
('slide2', '¿Por qué somos tu mejor opción?', 'No somos solo un laboratorio de ensayos; somos el blindaje técnico y legal de sus proyectos de ingeniería. Nuestro equipo está liderado por especialistas con más de 30 años de experiencia y certificaciones internacionales (ACI), brindando soluciones integrales en patología estructural, aseguramiento de calidad y gestión técnica. Aplicamos metodologías avanzadas para proteger la inversión, garantizar la seguridad estructural y asegurar la viabilidad de las obras más exigentes.', 'assets/puente-cantuta.jpeg', 2),
('vision', 'Visión', 'Ser un laboratorio de excelencia, alcanzando el reconocimiento de nuestros clientes por la confiabilidad en nuestros resultados de ensayos de laboratorio.', 'assets/ico-vision.png', 3),
('mision', 'Misión', 'Brindar resultados confiables prestando servicios de ensayos de alta calidad tecnica de manera responsable e imparcial, en base de nuestra experiencia y buscando siempre la mejora continua de nuestros procesos.', 'assets/ico-mision.png', 4),
('certificaciones', 'Nuestras Certificaciones - Sistemas de Gestión ICO', '<strong>ISO 9001:2015</strong> (ICO-SSGC-092025-9272-PE) - Sistema de gestión de calidad · <strong>ISO 14001:2015</strong> (ICO-SSGA-092025-8117-PE) - Gestión ambiental · <strong>ISO 45001:2018</strong> (ICO-SSGSST-092025-5516-PE) - Seguridad y salud en el trabajo · <strong>ISO 37001:2016</strong> (ICO-SSGAS-092025-4693-PE) - Sistema antisoborno. Adicionalmente, laboratorio acreditado por <strong>INACAL</strong> bajo la norma <strong>NTP-ISO/IEC 17025:2017</strong>. Vigencia: 29/09/2025 al 28/09/2026.', 'assets/iso-9001.png', 5);

INSERT IGNORE INTO nosotros_valores (id, nombre, icono_fa, orden, timestamp) VALUES
(1700000000001, 'Integridad Imparcial', 'fas fa-balance-scale', 1, 1700000000001),
(1700000000002, 'Mejora Continua', 'fas fa-chart-line', 2, 1700000000002),
(1700000000003, 'Compromiso Sostenible', 'fas fa-handshake', 3, 1700000000003),
(1700000000004, 'Excelencia y Precisión', 'fas fa-award', 4, 1700000000004),
(1700000000005, 'Transparencia', 'fas fa-shield-alt', 5, 1700000000005),
(1700000000006, 'Innovación Metodológica', 'fas fa-lightbulb', 6, 1700000000006);

INSERT IGNORE INTO nosotros_staff (id, nombre, cargo, descripcion, imagen, orden, timestamp) VALUES
(1700000000101, 'Jesus Angel Huaman Chavez', 'Gerente General', 'Lidera la operacion corporativa y la articulacion entre laboratorio, campo y direccion tecnica para proyectos de alta exigencia.', 'assets/staff/staff-jesus-huaman.jpeg', 1, 1700000000101),
(1700000000102, 'Jose Luis Huaman Chavez', 'Direccion Tecnica y Aseguramiento de Calidad', 'Ingeniero con CIP 279647 y maestria en Direccion y Administracion de la Construccion, orientado a QA/QC y liberacion tecnica de obra.', 'assets/staff/staff-joseluis-huaman.jpeg', 2, 1700000000102),
(1700000000103, 'Jose Alvarez Cangahuala', 'Consultor Senior y Especialista en Tecnologia del Concreto (I+D+i)', 'Ingeniero Civil UNI con MBA ESAN, Past-President del ACI Peru, Examinador Internacional ACI e Inspector NRMCA. Cuenta con mas de 30 anios de experiencia en innovacion, patologias estructurales y disenio de mezclas para megaproyectos y mineria.', 'assets/staff/staff-jose-alvarez.jpeg', 3, 1700000000103),
(1700000000104, 'William Vicman Hinostroza Rodriguez', 'Responsable Tecnico de Geotecnia y Pavimentos', 'Responsable del frente geotecnico y de pavimentos, con foco en ensayos de suelos, comportamiento del terreno y soporte tecnico de campo.', 'assets/staff/staff-william-hinostroza.jpeg', 4, 1700000000104),
(1700000000105, 'Gloria Tereza Chicoma Rojas', 'Especialista en Aseguramiento de Calidad (QA/QC)', 'Participa en control de calidad, trazabilidad y verificacion operativa de materiales y procesos bajo enfoque normativo.', 'assets/staff/staff-gloria-chicoma.jpeg', 5, 1700000000105),
(1700000000106, 'Jose Antonio Soruco', 'Especialista de Laboratorio y Ensayos', 'Responsable de la operacion de laboratorio, calibracion de equipos y ejecucion de ensayos bajo NTP-ISO/IEC 17025:2017.', 'assets/staff/staff-jose-soruco.jpeg', 6, 1700000000106),
(1700000000107, 'Eduardo Vidaud', 'Asesor Tecnico Internacional', 'Aporta vision tecnica internacional con foco en innovacion, capacitacion y transferencia de conocimiento al equipo.', 'assets/staff/staff-eduardo-vidaud.jpeg', 7, 1700000000107);
