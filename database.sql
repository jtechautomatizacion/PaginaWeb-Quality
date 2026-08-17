-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: group_tqc
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `group_tqc`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `group_tqc` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `group_tqc`;

--
-- Table structure for table `acreditaciones`
--

DROP TABLE IF EXISTS `acreditaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `acreditaciones` (
  `id` bigint(20) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `archivo_url` varchar(500) DEFAULT '',
  `archivo_tipo` enum('pdf','imagen','') NOT NULL DEFAULT '',
  `orden` int(11) NOT NULL DEFAULT 0,
  `timestamp` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acreditaciones`
--

LOCK TABLES `acreditaciones` WRITE;
/*!40000 ALTER TABLE `acreditaciones` DISABLE KEYS */;
INSERT INTO `acreditaciones` VALUES (1,'INACAL LE-234','Laboratorio de Ensayo acreditado bajo NTP-ISO/IEC 17025:2017. Vigencia hasta el 08/07/2027.','assets/uploads/acreditaciones/acreditaciones_6a769c67a22b77.68009390.png','imagen',1,1786156895000),(2,'ISO 9001:2015','Sistema de gestion de la calidad certificado por ICO.','','imagen',2,1786156895001),(3,'ISO 14001:2015','Sistema de gestion ambiental para operaciones tecnicas y de laboratorio.','','imagen',3,1786156895002),(4,'ISO 45001:2018','Sistema de seguridad y salud en el trabajo para entornos de alto riesgo.','','imagen',4,1786156895003),(5,'ISO 37001:2016','Sistema de gestion antisoborno con enfoque de integridad y transparencia.','','imagen',5,1786156895004);
/*!40000 ALTER TABLE `acreditaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clientes` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `logo_url` varchar(500) NOT NULL,
  `orden` int(11) NOT NULL DEFAULT 0,
  `timestamp` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'Menorca','assets/clientes/menorca.webp',1,1786156913001),(2,'Grupo Centenario','assets/clientes/grupo_centenario.webp',2,1786156913002),(3,'Inversiones El Pino','assets/clientes/inversiones_el_pino.webp',3,1786156913003),(4,'EsSalud','assets/clientes/es_salud.webp',4,1786156913004),(5,'Sedapal','assets/clientes/sedapal.webp',5,1786156913005),(6,'Lares','assets/clientes/lares.webp',6,1786156913006),(7,'Frionarval','assets/clientes/frionarval.webp',7,1786156913007),(8,'Bosch Arquitectos','assets/clientes/boscharquitectos.webp',8,1786156913008),(9,'Villanorma','assets/clientes/villanorma.webp',9,1786156913009),(10,'Malecon 30','assets/clientes/malecon30.webp',10,1786156913010),(11,'Global Billion','assets/clientes/globalbillion.webp',11,1786156913011),(12,'Los Portales','assets/clientes/losportales.webp',12,1786156913012),(13,'Clinica Angloamericana','assets/clientes/clinicaangloamericana.webp',13,1786156913013),(14,'Bimit','assets/clientes/bimit.webp',14,1786156913014),(15,'Numay','assets/clientes/numay.webp',15,1786156913015),(16,'Distribuidora Asia','assets/clientes/distribuidoraasia.webp',16,1786156913016),(17,'Inbioma','assets/clientes/inbioma.webp',17,1786156913017),(18,'Galilea','assets/clientes/galilea.webp',18,1786156913018),(19,'Kondu','assets/clientes/kondu.webp',19,1786156913019),(20,'Malachowski Arquitectos','assets/clientes/malachowskiarquitectos.webp',20,1786156913020),(21,'Masias','assets/clientes/masias.webp',21,1786156913021),(22,'Pugar Kitec','assets/clientes/pugarkitec.webp',22,1786156913022);
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contenido_sitio`
--

DROP TABLE IF EXISTS `contenido_sitio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contenido_sitio` (
  `clave` varchar(100) NOT NULL,
  `valor` text DEFAULT NULL,
  PRIMARY KEY (`clave`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contenido_sitio`
--

LOCK TABLES `contenido_sitio` WRITE;
/*!40000 ALTER TABLE `contenido_sitio` DISABLE KEYS */;
INSERT INTO `contenido_sitio` VALUES ('cursos_hero_intro','Oferta academica editable para publicar programas, modalidades, duracion, inversion y llamados a la accion.'),('cursos_hero_titulo','Cursos'),('investigacion_hero_intro','Tesis y articulos cientificos administrables para publicar investigacion, analisis tecnico y contenido especializado de la marca.'),('investigacion_hero_titulo','Investigacion'),('proyectos_hero_intro','Portafolio tecnico con proyectos destacados, enfoque ejecutivo y trazabilidad para seguir ampliando el portafolio desde el panel.'),('proyectos_hero_titulo','Proyectos'),('servicios_porque_texto','Por la capacidad de ofrecer un servicio íntegro en materia de aseguramiento y control de calidad (QA/QC), avalados por la acreditación INACAL bajo la norma NTP-ISO/IEC 17025:2017 y un sólido sistema de gestión certificado en ISO 9001, ISO 14001, ISO 45001 e ISO 37001. Nuestros ingenieros y técnicos con credenciales internacionales abordan proyectos de alta complejidad con eficacia y precisión.'),('servicios_porque_titulo','¿Por qué Group Total Quality Control es la mejor opción?');
/*!40000 ALTER TABLE `contenido_sitio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cursos`
--

DROP TABLE IF EXISTS `cursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cursos` (
  `id` bigint(20) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `resumen` text DEFAULT NULL,
  `imagen` varchar(500) DEFAULT NULL,
  `estado` enum('published','draft') NOT NULL DEFAULT 'published',
  `fecha` varchar(20) DEFAULT NULL,
  `timestamp` bigint(20) NOT NULL,
  `modalidad` varchar(255) DEFAULT NULL,
  `duracion` varchar(100) DEFAULT NULL,
  `nivel` varchar(100) DEFAULT NULL,
  `inversion` varchar(255) DEFAULT NULL,
  `docente` varchar(255) DEFAULT NULL,
  `docente_id` bigint(20) DEFAULT NULL,
  `docente_role` varchar(255) DEFAULT NULL,
  `docente_bio` text DEFAULT NULL,
  `docente_photo` varchar(512) DEFAULT NULL,
  `docente_linkedin` varchar(512) DEFAULT NULL,
  `contenido` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_cursos_slug` (`slug`),
  KEY `idx_cursos_timestamp` (`timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cursos`
--

LOCK TABLES `cursos` WRITE;
/*!40000 ALTER TABLE `cursos` DISABLE KEYS */;
INSERT INTO `cursos` VALUES (1773522014,'Muestreo estadistico para control de calidad en obra','demo-muestreo-estadistico-para-control-de-calidad-en-obra','Capacitacion tecnica aplicada en muestreo estadistico para control de calidad en obra. Incluye temar','https://placehold.co/84x56/eceff4/eceff4','draft','14/03/2026',1773522014,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(1773694814,'Gestion de proyectos de infraestructura bajo PMBOK','demo-gestion-de-proyectos-de-infraestructura-bajo-pmbok','Capacitacion tecnica aplicada en gestion de proyectos de infraestructura bajo pmbok. Incluye temario','https://placehold.co/84x56/eceff4/eceff4','draft','16/03/2026',1773694814,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(1773867614,'Investigacion aplicada para tesis en ingenieria civil','demo-investigacion-aplicada-para-tesis-en-ingenieria-civil','Capacitacion tecnica aplicada en investigacion aplicada para tesis en ingenieria civil. Incluye tema','https://placehold.co/84x56/eceff4/eceff4','draft','18/03/2026',1773867614,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(1774040414,'Control de calidad en mezclas asfalticas','demo-control-de-calidad-en-mezclas-asfalticas','Capacitacion tecnica aplicada en control de calidad en mezclas asfalticas. Incluye temario practico,','https://placehold.co/84x56/eceff4/eceff4','draft','20/03/2026',1774040414,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(1774213214,'Geotecnia para taludes y estabilidad de laderas','demo-geotecnia-para-taludes-y-estabilidad-de-laderas','Capacitacion tecnica aplicada en geotecnia para taludes y estabilidad de laderas. Incluye temario pr','https://placehold.co/84x56/eceff4/eceff4','draft','22/03/2026',1774213214,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(1774386014,'Diplomado internacional en control de calidad aplicado','demo-diplomado-internacional-en-control-de-calidad-aplicado','Capacitacion tecnica aplicada en diplomado internacional en control de calidad aplicado. Incluye tem','https://placehold.co/84x56/eceff4/eceff4','draft','24/03/2026',1774386014,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(1774558814,'Interpretacion de normas ASTM, NTP y ACI','demo-interpretacion-de-normas-astm-ntp-y-aci','Capacitacion tecnica aplicada en interpretacion de normas astm, ntp y aci. Incluye temario practico,','https://placehold.co/84x56/eceff4/eceff4','draft','26/03/2026',1774558814,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(1774731614,'Control topografico y geomatica para obra vial','demo-control-topografico-y-geomatica-para-obra-vial','Capacitacion tecnica aplicada en control topografico y geomatica para obra vial. Incluye temario pra','https://placehold.co/84x56/eceff4/eceff4','draft','28/03/2026',1774731614,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(1774904414,'Ensayos no destructivos: ultrasonido y pachometria','demo-ensayos-no-destructivos-ultrasonido-y-pachometria','Capacitacion tecnica aplicada en ensayos no destructivos: ultrasonido y pachometria. Incluye temario','https://placehold.co/84x56/eceff4/eceff4','draft','30/03/2026',1774904414,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(1775077214,'BIM para gestion de calidad en obras civiles','demo-bim-para-gestion-de-calidad-en-obras-civiles','Capacitacion tecnica aplicada en bim para gestion de calidad en obras civiles. Incluye temario pract','https://placehold.co/84x56/eceff4/eceff4','draft','01/04/2026',1775077214,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(1775250014,'Patologias del concreto: diagnostico y tratamiento','demo-patologias-del-concreto-diagnostico-y-tratamiento','Capacitacion tecnica aplicada en patologias del concreto: diagnostico y tratamiento. Incluye temario','https://placehold.co/84x56/eceff4/eceff4','draft','03/04/2026',1775250014,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(1775422814,'CBR, Proctor y densidad de campo paso a paso','demo-cbr-proctor-y-densidad-de-campo-paso-a-paso','Capacitacion tecnica aplicada en cbr, proctor y densidad de campo paso a paso. Incluye temario pract','https://placehold.co/84x56/eceff4/eceff4','draft','05/04/2026',1775422814,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(1775595614,'Exploracion geotecnica con SPT, DPL y PDC','demo-exploracion-geotecnica-con-spt-dpl-y-pdc','Capacitacion tecnica aplicada en exploracion geotecnica con spt, dpl y pdc. Incluye temario practico','https://placehold.co/84x56/eceff4/eceff4','draft','07/04/2026',1775595614,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(1775768414,'Peritaje tecnico-legal en estructuras de concreto','demo-peritaje-tecnico-legal-en-estructuras-de-concreto','Capacitacion tecnica aplicada en peritaje tecnico-legal en estructuras de concreto. Incluye temario','https://placehold.co/84x56/eceff4/eceff4','draft','09/04/2026',1775768414,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(1775865600,'QA/QC y control de calidad de concreto fresco y endurecido','curso-qa-qc-y-control-de-calidad-de-concreto','Programa tecnico orientado a control de variables en concreto fresco, elaboracion de probetas, inter','assets/company/control-concreto.jpeg','published','10/04/2026',1775865600,'Virtual o in company','24 horas','Intermedio','Cotizacion corporativa','Ing. Jesus Angel Huaman Chavez',1786247731599,'Tecnología del Concreto | RENACYT | Certificado ACI','Ingeniero Civil de la Universidad Continental, Gerente General de Group Total Quality Control. Investigador RENACYT Nivel VII con certificaciones ACI (Concrete Laboratory + Aggregate + Strength Testing), INECYC y CIP 356132. Especialista en tecnología del concreto, mecánica de suelos y patología estructural.','assets/staff/staff-jesus-huaman.jpeg','','Curso enfocado en el control integral del concreto desde su recepcion en obra hasta la interpretacion de resultados de resistencia y durabilidad. Ideal para profesionales de QA/QC, residentes, supervisores y laboratoristas.\n\n- Temperatura, slump, contenido de aire y peso unitario.\n- Elaboracion, curado y rotura de probetas.\n- Testigos diamantinos, esclerometria y ultrasonido.\n- Lectura de resultados para liberacion tecnica y control documental.'),(1775941214,'Ensayos de laboratorio para concreto fresco y endurecido','demo-ensayos-de-laboratorio-para-concreto-fresco-y-endurecido','Capacitacion tecnica aplicada en ensayos de laboratorio para concreto fresco y endurecido. Incluye t','https://placehold.co/84x56/eceff4/eceff4','draft','11/04/2026',1775941214,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(1776038400,'Geotecnia aplicada, pavimentos y ensayos de campo','curso-geotecnia-aplicada-y-pavimentos','Capacitacion para interpretar ensayos geotecnicos, densidad de campo, CBR, Proctor, exploracion del','assets/company/geotecnia-perfil.png','published','12/04/2026',1776038400,'Virtual con casos reales','30 horas','Intermedio - avanzado','Cotizacion corporativa','Ing. Rosendo Jose Antonio Soruco Zegada',1786247731609,'Pavimentos, Geotecnia y Tecnología del Hormigón','Consultor internacional con operaciones en Perú y Bolivia. Dirección técnica en diseño, construcción y rehabilitación de pavimentos para infraestructuras carreteras y aeroportuarias. Garantía de solvencia técnica y estricto cumplimiento normativo en obras de alta exigencia.','assets/staff/staff-jose-soruco.jpeg','','Programa dirigido a profesionales que necesitan fortalecer criterios de exploracion geotecnica, interpretacion de laboratorio y control de plataformas y pavimentos.\n\n- Granulometria, humedad, limites, gravedad especifica y clasificacion.\n- CBR, Proctor, densidad de campo y placa de carga.\n- Exploracion con SPT, DPL, PDC y lectura de perfiles estratigraficos.\n- Deflectometria, Viga Benkelman, rugosidad y criterios de control vial.'),(1776114014,'Diseño de pavimentos flexibles y rigidos bajo norma AASHTO','demo-diseno-de-pavimentos-flexibles-y-rigidos-bajo-norma-aashto','Capacitacion tecnica aplicada en diseño de pavimentos flexibles y rigidos bajo norma aashto. Incluye','https://placehold.co/84x56/eceff4/eceff4','draft','13/04/2026',1776114014,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(1776286814,'Mecanica de suelos aplicada a cimentaciones','demo-mecanica-de-suelos-aplicada-a-cimentaciones','Capacitacion tecnica aplicada en mecanica de suelos aplicada a cimentaciones. Incluye temario practi','https://placehold.co/84x56/eceff4/eceff4','draft','15/04/2026',1776286814,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(1776297600,'Patologia estructural, peritaje e investigacion aplicada','curso-patologia-estructural-peritaje-e-investigacion','Curso especializado en diagnostico de fallas, evaluacion estructural, blindaje tecnico-legal y metod','assets/company/consultoria-ensayo-no-destructivo.png','published','15/04/2026',1776297600,'Seminario ejecutivo','20 horas','Avanzado','Cotizacion corporativa','Ing. Eduardo Vidaud Quintana',1786247731621,'Patología y Diagnóstico Estructural','Ingeniero Civil con Maestría en Ingeniería Estructural por la UNAM (México). Consultor técnico del Instituto Mexicano del Cemento y del Concreto (IMCYC), miembro activo del ACI y exmiembro de la junta directiva de la Sociedad Mexicana de Ingeniería Estructural (SMIE). Certificado en Ensayos No Destructivos (NDT) por Germann Instruments.','assets/staff/staff-eduardo-vidaud.jpeg','','Curso pensado para especialistas que intervienen en evaluaciones complejas, controversias tecnicas, fallas de obra o proyectos de investigacion con necesidad de evidencia experimental.\n\n- Patologias tipicas en concreto, albanileria y cimentaciones.\n- Uso de ensayos no destructivos y testigos para diagnostico.\n- Estructura de informes periciales y blindaje tecnico-legal.\n- Diseno de rutas experimentales para tesis y articulos cientificos.'),(1776459614,'QA/QC en control de calidad de concreto en obras','demo-qa-qc-en-control-de-calidad-de-concreto-en-obras','Capacitacion tecnica aplicada en qa/qc en control de calidad de concreto en obras. Incluye temario p','https://placehold.co/84x56/eceff4/eceff4','draft','17/04/2026',1776459614,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `cursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `docentes`
--

DROP TABLE IF EXISTS `docentes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `docentes` (
  `id` bigint(20) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `resumen` text DEFAULT NULL,
  `imagen` varchar(512) DEFAULT NULL,
  `estado` varchar(20) DEFAULT 'published',
  `fecha` varchar(20) DEFAULT NULL,
  `timestamp` bigint(20) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `linkedin` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `docentes`
--

LOCK TABLES `docentes` WRITE;
/*!40000 ALTER TABLE `docentes` DISABLE KEYS */;
INSERT INTO `docentes` VALUES (1786247731599,'Ing. Jesus Angel Huaman Chavez','ing-jesus-angel-huaman-chavez','Tecnología del Concreto | RENACYT | Certificado ACI','assets/staff/staff-jesus-huaman.jpeg','published','09/08/2026',1786247731599,'Tecnología del Concreto | RENACYT | Certificado ACI','Ingeniero Civil de la Universidad Continental, Gerente General de Group Total Quality Control. Investigador RENACYT Nivel VII con certificaciones ACI (Concrete Laboratory + Aggregate + Strength Testing), INECYC y CIP 356132. Especialista en tecnología del concreto, mecánica de suelos y patología estructural.',''),(1786247731609,'Ing. Rosendo Jose Antonio Soruco Zegada','ing-rosendo-jose-antonio-soruco-zegada','Pavimentos, Geotecnia y Tecnología del Hormigón','assets/staff/staff-jose-soruco.jpeg','published','09/08/2026',1786247731609,'Pavimentos, Geotecnia y Tecnología del Hormigón','Consultor internacional con operaciones en Perú y Bolivia. Dirección técnica en diseño, construcción y rehabilitación de pavimentos para infraestructuras carreteras y aeroportuarias. Garantía de solvencia técnica y estricto cumplimiento normativo en obras de alta exigencia.',''),(1786247731621,'Ing. Eduardo Vidaud Quintana','ing-eduardo-vidaud-quintana','Patología y Diagnóstico Estructural','assets/staff/staff-eduardo-vidaud.jpeg','published','09/08/2026',1786247731621,'Patología y Diagnóstico Estructural','Ingeniero Civil con Maestría en Ingeniería Estructural por la UNAM (México). Consultor técnico del Instituto Mexicano del Cemento y del Concreto (IMCYC), miembro activo del ACI y exmiembro de la junta directiva de la Sociedad Mexicana de Ingeniería Estructural (SMIE). Certificado en Ensayos No Destructivos (NDT) por Germann Instruments.','');
/*!40000 ALTER TABLE `docentes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estadisticas`
--

DROP TABLE IF EXISTS `estadisticas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `estadisticas` (
  `id` bigint(20) NOT NULL,
  `valor` varchar(60) NOT NULL,
  `etiqueta` varchar(255) NOT NULL,
  `orden` int(11) NOT NULL DEFAULT 0,
  `timestamp` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estadisticas`
--

LOCK TABLES `estadisticas` WRITE;
/*!40000 ALTER TABLE `estadisticas` DISABLE KEYS */;
INSERT INTO `estadisticas` VALUES (1,'50','Tipos de servicio',1,1786162061001),(2,'100','Proyectos completados',2,1786162061002),(3,'3+','Anios de experiencia',3,1786162061003),(4,'ISO 9001:2015','Politica de calidad, imparcialidad y confidencialidad',4,1786162061004);
/*!40000 ALTER TABLE `estadisticas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `investigacion`
--

DROP TABLE IF EXISTS `investigacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `investigacion` (
  `id` bigint(20) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `resumen` text DEFAULT NULL,
  `imagen` varchar(500) DEFAULT NULL,
  `estado` enum('published','draft') NOT NULL DEFAULT 'published',
  `fecha` varchar(20) DEFAULT NULL,
  `contenido` text DEFAULT NULL,
  `docente` varchar(255) DEFAULT NULL,
  `timestamp` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_investigacion_slug` (`slug`),
  KEY `idx_investigacion_timestamp` (`timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `investigacion`
--

LOCK TABLES `investigacion` WRITE;
/*!40000 ALTER TABLE `investigacion` DISABLE KEYS */;
INSERT INTO `investigacion` VALUES (1775741400,'Blindaje tecnico-legal y diagnostico estructural para decisiones de alto riesgo','blindaje-tecnico-legal-y-diagnostico-estructural-para-decisiones-de-alto-riesgo','Como Group Total Quality Control integra peritaje, evidencias experimentales y lectura tecnica para','assets/consultoria-ensayo-no-destructivo.png','published','09/04/2026','','Aseguramiento de Calidad Group TQC',1775741400),(1775743200,'Investigacion aplicada y soporte experimental para tesis y articulos cientificos','investigacion-aplicada-y-soporte-experimental-para-tesis-y-articulos-cientificos','La unidad I+D+i de Group Total Quality Control acompana investigaciones, valida materiales y brinda','assets/patologia-estructural-avanzada.png','published','09/04/2026','','Aseguramiento de Calidad Group TQC',1775743200),(1775745000,'INACAL LE-234 e ISO: por que la acreditacion cambia el valor del QA/QC','inacal-le-234-e-iso-por-que-la-acreditacion-cambia-el-valor-del-qa-qc','<p>La acreditacion de laboratorio y los sistemas ISO no son solo distintivos comerciales: son la base p</p>','assets/inacal-le-234.png','published','09/04/2026','<p class=\"ql-align-justify\">En control de calidad, el resultado de un ensayo solo tiene valor cuando existe confianza en el metodo, en la ejecucion y en la trazabilidad del proceso. Por eso la acreditacion y los sistemas de gestion son parte central de la promesa tecnica de un laboratorio.</p><p class=\"ql-align-justify\">Group Total Quality Control cuenta con acreditacion INACAL LE-234 bajo NTP-ISO/IEC 17025:2017, ademas de sistemas ISO 9001, 14001, 37001 y 45001. Este respaldo fortalece la confiabilidad del servicio desde la toma de muestra hasta la emision del informe.</p><h3>Que garantiza una operacion acreditada</h3><ul><li>Metodos controlados y personal competente.</li><li>Trazabilidad de equipos, registros y resultados.</li><li>Mayor consistencia para auditorias, supervision y liberacion de obra.</li><li>Confianza para clientes publicos, privados y academicos.</li></ul><p class=\"ql-align-justify\">Cuando el proyecto depende de decisiones criticas, la calidad del dato importa tanto como la velocidad de respuesta. La acreditacion convierte ese dato en una herramienta confiable para ejecutar, corregir o defender tecnicamente una intervencion.</p><p><br></p>','Aseguramiento de Calidad Group TQC',1775745000);
/*!40000 ALTER TABLE `investigacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nosotros_bloques`
--

DROP TABLE IF EXISTS `nosotros_bloques`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nosotros_bloques` (
  `clave` varchar(40) NOT NULL,
  `titulo` varchar(255) NOT NULL DEFAULT '',
  `contenido` longtext DEFAULT NULL,
  `imagen` varchar(255) DEFAULT '',
  `orden` int(11) DEFAULT 0,
  PRIMARY KEY (`clave`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nosotros_bloques`
--

LOCK TABLES `nosotros_bloques` WRITE;
/*!40000 ALTER TABLE `nosotros_bloques` DISABLE KEYS */;
INSERT INTO `nosotros_bloques` VALUES ('certificaciones','Nuestras Certificaciones - Sistemas de Gestión ICO','<strong>ISO 9001:2015</strong> (ICO-SSGC-092025-9272-PE) - Sistema de gestión de calidad · <strong>ISO 14001:2015</strong> (ICO-SSGA-092025-8117-PE) - Gestión ambiental · <strong>ISO 45001:2018</strong> (ICO-SSGSST-092025-5516-PE) - Seguridad y salud en el trabajo · <strong>ISO 37001:2016</strong> (ICO-SSGAS-092025-4693-PE) - Sistema antisoborno. Adicionalmente, laboratorio acreditado por <strong>INACAL</strong> bajo la norma <strong>NTP-ISO/IEC 17025:2017</strong>. Vigencia: 29/09/2025 al 28/09/2026.','assets/iso-9001.png',5),('mision','Misión','Brindar resultados confiables prestando servicios de ensayos de alta calidad tecnica de manera responsable e imparcial, en base de nuestra experiencia y buscando siempre la mejora continua de nuestros procesos.','assets/ico-mision.png',4),('slide1','¿Quiénes somos?','Group Total Quality Control S.A.C. es una firma peruana de ingeniería especializada en el aseguramiento y control de calidad (QA/QC) integral para proyectos de infraestructura vial, edificación comercial, saneamiento y minería.<br>\nAvalados por la acreditación del Instituto Nacional de Calidad (INACAL) bajo la norma NTP-ISO/IEC 17025:2017 y un sólido sistema de gestión certificado en ISO 9001, ISO 14001, ISO 45001 e ISO 37001, nos posicionamos como el socio estratégico que certifica la viabilidad, seguridad estructural y durabilidad operativa de las obras más exigentes.','assets/quienes-somos.jpeg',1),('slide2','¿Por qué somos tu mejor opción?','No somos solo un laboratorio de ensayos; somos el blindaje técnico y legal de sus proyectos de ingeniería. Nuestro equipo está liderado por especialistas con más de 30 años de experiencia y certificaciones internacionales (ACI), brindando soluciones integrales en patología estructural, aseguramiento de calidad y gestión técnica. Aplicamos metodologías avanzadas para proteger la inversión, garantizar la seguridad estructural y asegurar la viabilidad de las obras más exigentes.','assets/puente-cantuta.jpeg',2),('vision','Visión','Ser un laboratorio de excelencia, alcanzando el reconocimiento de nuestros clientes por la confiabilidad en nuestros resultados de ensayos de laboratorio.','assets/ico-vision.png',3);
/*!40000 ALTER TABLE `nosotros_bloques` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nosotros_staff`
--

DROP TABLE IF EXISTS `nosotros_staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nosotros_staff` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `cargo` varchar(200) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `imagen` varchar(255) DEFAULT '',
  `orden` int(11) DEFAULT 0,
  `timestamp` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nosotros_staff`
--

LOCK TABLES `nosotros_staff` WRITE;
/*!40000 ALTER TABLE `nosotros_staff` DISABLE KEYS */;
INSERT INTO `nosotros_staff` VALUES (1700000000101,'Jesus Angel Huaman Chavez','Gerente General','Lidera la operacion corporativa y la articulacion entre laboratorio, campo y direccion tecnica para proyectos de alta exigencia.','assets/staff/staff-jesus-huaman.jpeg',1,1700000000101),(1700000000102,'Jose Luis Huaman Chavez','Direccion Tecnica y Aseguramiento de Calidad','Ingeniero con CIP 279647 y maestria en Direccion y Administracion de la Construccion, orientado a QA/QC y liberacion tecnica de obra.','assets/staff/staff-joseluis-huaman.jpeg',2,1700000000102),(1700000000103,'Jose Alvarez Cangahuala','Consultor Senior y Especialista en Tecnologia del Concreto (I+D+i)','Ingeniero Civil UNI con MBA ESAN, Past-President del ACI Peru, Examinador Internacional ACI e Inspector NRMCA. Cuenta con mas de 30 anios de experiencia en innovacion, patologias estructurales y disenio de mezclas para megaproyectos y mineria.','assets/staff/staff-jose-alvarez.jpeg',3,1700000000103),(1700000000104,'William Vicman Hinostroza Rodriguez','Responsable Tecnico de Geotecnia y Pavimentos','Responsable del frente geotecnico y de pavimentos, con foco en ensayos de suelos, comportamiento del terreno y soporte tecnico de campo.','assets/staff/staff-william-hinostroza.jpeg',4,1700000000104),(1700000000105,'Gloria Tereza Chicoma Rojas','Especialista en Aseguramiento de Calidad (QA/QC)','Participa en control de calidad, trazabilidad y verificacion operativa de materiales y procesos bajo enfoque normativo.','assets/staff/staff-gloria-chicoma.jpeg',5,1700000000105),(1700000000106,'Jose Antonio Soruco','Especialista de Laboratorio y Ensayos','Responsable de la operacion de laboratorio, calibracion de equipos y ejecucion de ensayos bajo NTP-ISO/IEC 17025:2017.','assets/staff/staff-jose-soruco.jpeg',6,1700000000106),(1700000000107,'Eduardo Vidaud','Asesor Tecnico Internacional','Aporta vision tecnica internacional con foco en innovacion, capacitacion y transferencia de conocimiento al equipo.','assets/staff/staff-eduardo-vidaud.jpeg',7,1700000000107);
/*!40000 ALTER TABLE `nosotros_staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nosotros_trayectoria`
--

DROP TABLE IF EXISTS `nosotros_trayectoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nosotros_trayectoria` (
  `id` bigint(20) NOT NULL,
  `numero` varchar(20) NOT NULL,
  `sufijo` varchar(20) DEFAULT '',
  `etiqueta` varchar(150) NOT NULL,
  `enlace_texto` varchar(100) DEFAULT '',
  `enlace_url` varchar(255) DEFAULT '',
  `orden` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nosotros_trayectoria`
--

LOCK TABLES `nosotros_trayectoria` WRITE;
/*!40000 ALTER TABLE `nosotros_trayectoria` DISABLE KEYS */;
INSERT INTO `nosotros_trayectoria` VALUES (1700000000201,'3','AÑOS','de experiencia técnica','','',1),(1700000000202,'35','','Proyectos a nivel nacional','Ver más proyectos','proyectos_publico.html',2),(1700000000203,'50','','Tipos de ensayos normados','','',3);
/*!40000 ALTER TABLE `nosotros_trayectoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nosotros_valores`
--

DROP TABLE IF EXISTS `nosotros_valores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nosotros_valores` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `icono_fa` varchar(50) NOT NULL DEFAULT 'fas fa-star',
  `orden` int(11) DEFAULT 0,
  `timestamp` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nosotros_valores`
--

LOCK TABLES `nosotros_valores` WRITE;
/*!40000 ALTER TABLE `nosotros_valores` DISABLE KEYS */;
INSERT INTO `nosotros_valores` VALUES (1700000000001,'Integridad Imparcial','fas fa-balance-scale',1,1700000000001),(1700000000002,'Mejora Continua','fas fa-chart-line',2,1700000000002),(1700000000003,'Compromiso Sostenible','fas fa-handshake',3,1700000000003),(1700000000004,'Excelencia y Precisión','fas fa-award',4,1700000000004),(1700000000005,'Transparencia','fas fa-shield-alt',5,1700000000005),(1700000000006,'Innovación Metodológica','fas fa-lightbulb',6,1700000000006);
/*!40000 ALTER TABLE `nosotros_valores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proyectos`
--

DROP TABLE IF EXISTS `proyectos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `proyectos` (
  `id` bigint(20) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `resumen` text DEFAULT NULL,
  `imagen` varchar(500) DEFAULT NULL,
  `estado` enum('published','draft') NOT NULL DEFAULT 'published',
  `ubicacion` varchar(255) DEFAULT NULL,
  `fecha` varchar(60) DEFAULT NULL,
  `fecha_admin` varchar(20) DEFAULT NULL,
  `timestamp` bigint(20) NOT NULL,
  `categoria` varchar(255) DEFAULT NULL,
  `empresa` varchar(255) DEFAULT NULL,
  `contenido` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_proyectos_slug` (`slug`),
  KEY `idx_proyectos_timestamp` (`timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proyectos`
--

LOCK TABLES `proyectos` WRITE;
/*!40000 ALTER TABLE `proyectos` DISABLE KEYS */;
INSERT INTO `proyectos` VALUES (1775746800,'Ensayos especializados para SIMA Callao','ensayos-especializados-para-sima-callao','Portafolio de ensayos de laboratorio para concreto, suelos y pavimentos, con soporte tecnico para li','assets/company/control-concreto.jpeg','published','Callao - Lima','Ejecutado en 2024','07/08/2026',1775746800,'Ensayos de laboratorio y control de calidad','SIMA Callao','Group Total Quality Control participo en la ejecucion de ensayos especializados de laboratorio para concreto, suelos y pavimentos. El servicio se enfoco en producir resultados confiables para la liberacion tecnica de elementos estructurales criticos y en fortalecer el control de calidad durante la ejecucion.\n\nEl alcance considero densidades, resistencia a la compresion y verificacion de materiales, integrando trazabilidad documental y soporte tecnico orientado a decisiones de obra.'),(1775747700,'Mecanica de suelos y consultoria geotecnica para Camino Vecinal Pangoa','mecanica-de-suelos-y-consultoria-geotecnica-para-camino-vecinal-pangoa','Intervencion tecnica vinculada a la Contraloria General para estudios de mecanica de suelos y consul','assets/company/geotecnia-perfil.png','published','Pangoa - Junin','Ejecutado en 2024','07/08/2026',1775747700,'Geotecnia y control vial','Contraloria General de la Republica','En este encargo, Group Total Quality Control desarrollo estudios de mecanica de suelos y consultoria geotecnica especializada para el Camino Vecinal Pangoa. El trabajo aporto evidencia tecnica para la revision y el seguimiento de condiciones del terreno en una intervencion de mantenimiento vial.\n\nLa experiencia refuerza la capacidad de la firma para actuar en contextos donde se requiere criterio tecnico, documentacion robusta y coordinacion con entidades de control.'),(1775748600,'Extraccion de testigos y evaluacion del Puente Colgante Rio Pangoa','extraccion-de-testigos-y-evaluacion-del-puente-colgante-rio-pangoa','Evaluacion estructural avanzada para la Municipalidad Distrital de Mazamari, incluyendo extraccion d','assets/company/patologia-estructural-avanzada.png','published','Mazamari - Junin','Ejecutado en 2025','07/08/2026',1775748600,'Evaluacion estructural y testigos de concreto','Municipalidad Distrital de Mazamari','Para el Puente Colgante Rio Pangoa, Group Total Quality Control ejecuto extraccion de testigos de concreto y una evaluacion estructural avanzada orientada a determinar la condicion real de la infraestructura existente.\n\nLa intervencion permitio contar con evidencia tecnica para valorar seguridad, viabilidad y posibles acciones correctivas, integrando criterio de patologia estructural y soporte documental para la toma de decisiones.');
/*!40000 ALTER TABLE `proyectos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicios`
--

DROP TABLE IF EXISTS `servicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `servicios` (
  `id` bigint(20) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `resumen` text DEFAULT NULL,
  `contenido` text DEFAULT NULL,
  `imagen` varchar(500) DEFAULT NULL,
  `estado` enum('published','draft') NOT NULL DEFAULT 'published',
  `destacado` tinyint(1) NOT NULL DEFAULT 0,
  `fecha` varchar(20) DEFAULT NULL,
  `timestamp` bigint(20) NOT NULL,
  `incluye` text DEFAULT NULL,
  `galeria` text DEFAULT NULL,
  `intro_imagen` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_servicios_slug` (`slug`),
  KEY `idx_servicios_timestamp` (`timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicios`
--

LOCK TABLES `servicios` WRITE;
/*!40000 ALTER TABLE `servicios` DISABLE KEYS */;
INSERT INTO `servicios` VALUES (1776495000,'Asesoria, Consultoria e Investigacion (QUALITY)','asesoria-consultoria-e-investigacion-quality','Consultoria y blindaje tecnico-legal con mas de 30 anos de trayectoria. Diagnostico estructural, per',NULL,'https://placehold.co/640x480/e9edf5/e9edf5','published',0,'18/04/2026',1776495000,'[\"Diagnostico, evaluacion y peritaje estructural\",\"Identificacion de fallas, deformaciones y asentamientos\",\"Ensayos no destructivos (ultrasonido, esclerometria, georadar)\",\"Investigacion cientifica y soporte para publicaciones indexadas\",\"Desarrollo de nuevos materiales y diseno de mezclas\",\"Asesoria de tesis de pregrado y posgrado\"]','[{\"imagen\":\"assets\\/company\\/ensayos\\/asesoria\\/ultrasonido.jpg\",\"titulo\":\"Ensayo de ultrasonido en concreto\",\"norma\":\"Ensayo no destructivo\"},{\"imagen\":\"assets\\/company\\/ensayos\\/asesoria\\/no-destructivo.jpg\",\"titulo\":\"Inspeccion estructural in situ\",\"norma\":\"Patologia y peritaje\"},{\"imagen\":\"assets\\/company\\/ensayos\\/asesoria\\/articulos-cientificos.jpg\",\"titulo\":\"Publicaciones cientificas indexadas\",\"norma\":\"Scopus \\/ RENATI \\/ RENACYT\"}]','assets/company/asesoria/no-destructivo.jpg'),(1776495039,'Mecanica de Suelos y Geotecnia','mecanica-de-suelos-y-geotecnia','Informacion precisa del comportamiento del terreno para cimentaciones seguras, movimiento de tierras',NULL,'https://placehold.co/640x480/e9edf5/e9edf5','published',0,'18/04/2026',1776495039,'[\"Densidad de campo y control de calidad en obra.\",\"Perfil estratigrafico, limites, clasificacion y granulometria.\",\"CBR, Proctor, gravedad especifica y humedad natural.\",\"Compresion triaxial UU, CU y CD.\",\"SPT, DPL, PDC, placa de carga, Lugeon y Lefranc.\"]','[{\"imagen\":\"assets\\/company\\/ensayos\\/mecanica-suelos\\/densidad-campo.png\",\"titulo\":\"Densidad de campo\",\"norma\":\"Control en obra\"},{\"imagen\":\"assets\\/company\\/ensayos\\/mecanica-suelos\\/perfil-estratigrafico.png\",\"titulo\":\"Perfil estratigrafico del suelo\",\"norma\":\"Calicatas y exposicion\"},{\"imagen\":\"assets\\/company\\/ensayos\\/mecanica-suelos\\/capacidad-portante.jpeg\",\"titulo\":\"Resistencia y capacidad portante\",\"norma\":\"Compresibilidad\"},{\"imagen\":\"assets\\/company\\/ensayos\\/mecanica-suelos\\/cbr-valor-soporte.png\",\"titulo\":\"Valor relativo de soporte (CBR)\",\"norma\":\"ASTM D1883\"}]','assets/company/geotecnia-perfil.png'),(1785650547202,'Exploracion Geofisica, Mecanica de Rocas y Ensayos Quimicos','exploracion-geofisica-mecanica-de-rocas-y-ensayos-quimicos','Servicios especializados para caracterizacion del subsuelo, comportamiento de macizos y composicion',NULL,'https://placehold.co/640x480/e9edf5/e9edf5','published',0,'02/08/2026',1785650547202,'[\"Refraccion sismica bajo ASTM D5777.\",\"Sondajes MASW, MAM y resistividad electrica.\",\"Conductividad termica y exploracion geofisica.\",\"Sales, cloruros, sulfatos, sulfuros y carbonatos.\",\"Corte directo a gran escala y perforacion en suelos y rocas.\"]','[{\"imagen\":\"assets\\/company\\/ensayos\\/geofisica\\/refraccion-sismica-astm-d5777.png\",\"titulo\":\"Refraccion sismica\",\"norma\":\"ASTM D5777\"}]','assets/company/laboratorio-cbr.jpeg'),(1785650548386,'Evaluacion y Calidad en Sistemas de Albanileria','evaluacion-y-calidad-en-sistemas-de-albanileria','Ensayos para unidades, pilas y muretes que respaldan diagnostico estructural, control de calidad y c',NULL,'https://placehold.co/640x480/e9edf5/e9edf5','published',1,'02/08/2026',1785650548386,'[\"Variacion dimensional y absorcion en unidades.\",\"Compresion axial en pilas de albanileria.\",\"Compresion diagonal en muretes.\",\"Succion, eflorescencia y flexotraccion.\",\"Verificacion de bloques, adoquines y ladrillos.\"]','[{\"imagen\":\"assets\\/company\\/ensayos\\/albanileria\\/compresion-axial-pilas-astm-c1314.png\",\"titulo\":\"Compresion axial en pilas\",\"norma\":\"ASTM C1314\"},{\"imagen\":\"assets\\/company\\/ensayos\\/albanileria\\/compresion-diagonal-ntp-399-621.png\",\"titulo\":\"Compresion diagonal en muretes\",\"norma\":\"NTP 399.621\"},{\"imagen\":\"assets\\/company\\/ensayos\\/albanileria\\/variacion-dimensional-ntp-399-612.png\",\"titulo\":\"Variacion dimensional unidades\",\"norma\":\"NTP 399.612\"}]','assets/company/patologia-estructural-avanzada.png'),(1785650549479,'Pavimentos Flexibles y Mezclas Asfalticas','pavimentos-flexibles-y-mezclas-asfalticas','Control integral de mezclas, briquetas y comportamiento superficial para obras viales y mantenimient',NULL,'https://placehold.co/640x480/e9edf5/e9edf5','published',1,'02/08/2026',1785650549479,'[\"Deflectometria, Viga Benkelman y rugosidad Merlin.\",\"Pendulo de friccion y circulo de arena.\",\"Lavado asfaltico y verificacion de porcentaje de asfalto.\",\"Disenio de mezcla Marshall.\",\"Elaboracion, estabilidad y flujo de briquetas.\"]','[{\"imagen\":\"assets\\/company\\/ensayos\\/pavimentos\\/deflectometria-astm-d4694.png\",\"titulo\":\"Deflectometria en pavimentos flexibles\",\"norma\":\"ASTM D4694\"}]','assets/company/hero-campo.jpeg'),(1785650550575,'Evaluacion de Concreto Endurecido','evaluacion-de-concreto-endurecido','Ensayos para verificar resistencia, durabilidad, integridad y comportamiento mecanico de elementos e',NULL,'https://placehold.co/640x480/e9edf5/e9edf5','published',1,'02/08/2026',1785650550575,'[\"Compresion de probetas y testigos diamantinos.\",\"Extraccion y tallado de nucleos de concreto.\",\"Grado de carbonatacion y esclerometria.\",\"Modulo de elasticidad estatico y dinamico por ultrasonido.\",\"Flexion, traccion diametral y densidad del concreto endurecido.\"]','[{\"imagen\":\"assets\\/company\\/ensayos\\/concreto-endurecido\\/compresion-probetas-ntp-339-034.png\",\"titulo\":\"Compresion en probetas\",\"norma\":\"NTP 339.034\"},{\"imagen\":\"assets\\/company\\/ensayos\\/concreto-endurecido\\/testigos-diamantinos-ntp-399-059.png\",\"titulo\":\"Testigos diamantinos\",\"norma\":\"NTP 399.059\"},{\"imagen\":\"assets\\/company\\/ensayos\\/concreto-endurecido\\/carbonatacion-astm-c856.png\",\"titulo\":\"Profundidad de carbonatacion\",\"norma\":\"ASTM C856\"}]','assets/company/control-concreto.jpeg'),(1785650551715,'Control de Calidad de Concreto Fresco','control-de-calidad-de-concreto-fresco','<p>Monitoreo de variables criticas para asegurar la conformidad del concreto antes de su colocacion y luego de su endurecimiento.</p>','<p>Monitoreo de variables criticas para asegurar la conformidad del concreto antes de su colocacion y luego de su endurecimiento.111</p>','https://placehold.co/640x480/e9edf5/e9edf5','published',1,'02/08/2026',1785650551715,'[\"Temperatura del concreto fresco.\",\"Asentamiento slump.\",\"Peso unitario, rendimiento y exudacion.\",\"Contenido de aire por metodo de presion.\",\"Elaboracion y curado de probetas.\"]','[{\"imagen\":\"assets\\/company\\/ensayos\\/concreto-fresco\\/temperatura-ntp-339-184.png\",\"titulo\":\"Temperatura del concreto fresco\",\"norma\":\"NTP 339.184:2021\"},{\"imagen\":\"assets\\/company\\/ensayos\\/concreto-fresco\\/slump-ntp-339-035.jpeg\",\"titulo\":\"Asentamiento (Slump)\",\"norma\":\"NTP 339.035:2021\"},{\"imagen\":\"assets\\/company\\/ensayos\\/concreto-fresco\\/probetas-ntp-339-033-1.jpeg\",\"titulo\":\"Elaboracion de probetas\",\"norma\":\"NTP 339.033\"},{\"imagen\":\"assets\\/company\\/ensayos\\/concreto-fresco\\/probetas-ntp-339-033-2.png\",\"titulo\":\"Curado de probetas\",\"norma\":\"NTP 339.033\"}]','assets/company/concreto-fresco-temperatura.png');
/*!40000 ALTER TABLE `servicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `contrasena_changed` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario` (`usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (3,'admin','admin',1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-09  3:22:37
