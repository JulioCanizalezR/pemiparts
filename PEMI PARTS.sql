-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.32-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for pemidb
DROP DATABASE IF EXISTS `pemidb`;
CREATE DATABASE IF NOT EXISTS `pemidb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `pemidb`;

-- Dumping structure for procedure pemidb.InsertarClientesAleatorios
DROP PROCEDURE IF EXISTS `InsertarClientesAleatorios`;
DELIMITER //
CREATE PROCEDURE `InsertarClientesAleatorios`()
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE random_day INT;
    DECLARE random_month INT;
    
    WHILE i <= 53 DO
        -- Generar un día aleatorio entre 1 y 28 para evitar problemas con meses cortos
        SET random_day = FLOOR(1 + (RAND() * 28));
        -- Generar un mes aleatorio entre 1 y 12
        SET random_month = FLOOR(1 + (RAND() * 12));

        -- Insertar un cliente con datos aleatorios
        INSERT INTO `tb_clientes` 
            (`nombre_cliente`, `apellido_cliente`, `correo_electronico_cliente`, `direccion_cliente`, `id_empresa`, `numero_telefono_cliente`, `fax_cliente`, `fecha_registro_cliente`, `sufijo_cliente`)
        VALUES 
            (CONCAT('Cliente', i), CONCAT('Apellido', i), CONCAT('cliente', i, '@example.com'), CONCAT('Direccion ', i), 
             FLOOR(1 + (RAND() * 8)), -- ID de empresa aleatorio entre 1 y 8
             CONCAT('555-', LPAD(FLOOR(RAND() * 10000), 4, '0')), 
             CONCAT('555-', LPAD(FLOOR(RAND() * 10000), 4, '0')), 
             CONCAT('2024-', LPAD(random_month, 2, '0'), '-', LPAD(random_day, 2, '0')),
             CASE WHEN i % 2 = 0 THEN 'Sr.' ELSE 'Sra.' END);

        -- Incrementar el contador
        SET i = i + 1;
    END WHILE;
END//
DELIMITER ;

-- Dumping structure for table pemidb.tb_almacenamientos
DROP TABLE IF EXISTS `tb_almacenamientos`;
CREATE TABLE IF NOT EXISTS `tb_almacenamientos` (
  `id_almacenamiento` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_almacenamiento` varchar(200) DEFAULT NULL,
  `tiempo_inicial` date DEFAULT NULL,
  `tiempo_final` date DEFAULT NULL,
  PRIMARY KEY (`id_almacenamiento`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pemidb.tb_almacenamientos: ~8 rows (approximately)
INSERT IGNORE INTO `tb_almacenamientos` (`id_almacenamiento`, `nombre_almacenamiento`, `tiempo_inicial`, `tiempo_final`) VALUES
	(1, 'Almacen Central', '2024-01-01', '2024-12-31'),
	(2, 'Almacen Norte', '2024-02-01', '2024-11-30'),
	(3, 'Almacen Sur', '2024-03-01', '2024-10-31'),
	(4, 'Almacen Este', '2024-04-01', '2024-09-30'),
	(5, 'Almacen Oeste', '2024-05-01', '2024-08-31'),
	(6, 'Almacen Principal', '2024-06-01', '2024-07-31'),
	(7, 'Almacen Secundario', '2024-07-01', '2024-06-30'),
	(8, 'Almacen de Emergencia', '2024-08-01', '2024-05-31');

-- Dumping structure for table pemidb.tb_categorias
DROP TABLE IF EXISTS `tb_categorias`;
CREATE TABLE IF NOT EXISTS `tb_categorias` (
  `id_categoria` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pemidb.tb_categorias: ~8 rows (approximately)
INSERT IGNORE INTO `tb_categorias` (`id_categoria`, `nombre`) VALUES
	(1, 'Electrónica'),
	(2, 'Muebles'),
	(3, 'Ropa'),
	(4, 'Alimentos'),
	(5, 'Libros'),
	(6, 'Juguetes'),
	(7, 'Herramientas'),
	(8, 'Automotriz');

-- Dumping structure for table pemidb.tb_chat
DROP TABLE IF EXISTS `tb_chat`;
CREATE TABLE IF NOT EXISTS `tb_chat` (
  `id_chat` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario_emisor` int(11) DEFAULT NULL,
  `id_usuario_receptor` int(11) DEFAULT NULL,
  `mensaje` varchar(250) DEFAULT NULL,
  `fecha_registro` date DEFAULT current_timestamp(),
  PRIMARY KEY (`id_chat`),
  KEY `fk_id_usuario_emisor` (`id_usuario_emisor`),
  KEY `fk_id_usuario_receptor` (`id_usuario_receptor`),
  CONSTRAINT `fk_id_usuario_emisor` FOREIGN KEY (`id_usuario_emisor`) REFERENCES `tb_usuarios` (`id_usuario`),
  CONSTRAINT `fk_id_usuario_receptor` FOREIGN KEY (`id_usuario_receptor`) REFERENCES `tb_usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pemidb.tb_chat: ~0 rows (approximately)

-- Dumping structure for table pemidb.tb_clientes
DROP TABLE IF EXISTS `tb_clientes`;
CREATE TABLE IF NOT EXISTS `tb_clientes` (
  `id_cliente` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_cliente` varchar(200) NOT NULL,
  `apellido_cliente` varchar(200) NOT NULL,
  `correo_electronico_cliente` varchar(200) NOT NULL,
  `direccion_cliente` varchar(200) NOT NULL,
  `id_empresa` int(11) DEFAULT NULL,
  `numero_telefono_cliente` varchar(200) NOT NULL,
  `fax_cliente` varchar(200) NOT NULL,
  `fecha_registro_cliente` date NOT NULL,
  `sufijo_cliente` varchar(150) NOT NULL,
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `correo_electronico_cliente` (`correo_electronico_cliente`),
  KEY `fk_empresa_cliente` (`id_empresa`),
  CONSTRAINT `fk_empresa_cliente` FOREIGN KEY (`id_empresa`) REFERENCES `tb_empresas` (`id_empresa`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pemidb.tb_clientes: ~62 rows (approximately)
INSERT IGNORE INTO `tb_clientes` (`id_cliente`, `nombre_cliente`, `apellido_cliente`, `correo_electronico_cliente`, `direccion_cliente`, `id_empresa`, `numero_telefono_cliente`, `fax_cliente`, `fecha_registro_cliente`, `sufijo_cliente`) VALUES
	(1, 'Carlos', 'Perez', 'carlos.perez@example.com', 'Calle 123', 1, '555-1234', '555-1235', '2024-01-01', 'Sr.'),
	(2, 'Ana', 'Lopez', 'ana.lopez@example.com', 'Avenida 456', 2, '555-5678', '555-5679', '2024-02-01', 'Sra.'),
	(3, 'Juan', 'Gomez', 'juan.gomez@example.com', 'Boulevard 789', 3, '555-9012', '555-9013', '2024-03-01', 'Sr.'),
	(4, 'Maria', 'Diaz', 'maria.diaz@example.com', 'Carretera 012', 4, '555-3456', '555-3457', '2024-04-01', 'Sra.'),
	(5, 'Luis', 'Ramirez', 'luis.ramirez@example.com', 'Paseo 345', 5, '555-7890', '555-7891', '2024-05-01', 'Sr.'),
	(6, 'Laura', 'Fernandez', 'laura.fernandez@example.com', 'Plaza 678', 6, '555-2345', '555-2346', '2024-06-01', 'Sra.'),
	(7, 'Diego', 'Martinez', 'diego.martinez@example.com', 'Sendero 901', 7, '555-6789', '555-6790', '2024-07-01', 'Sr.'),
	(8, 'Marta', 'Garcia', 'marta.garcia@example.com', 'Puente 234', 8, '555-0123', '555-0124', '2024-08-01', 'Sra.'),
	(9, 'Juan', 'Perez', 'juan.perez@example.com', 'Puente 123', 8, '666-0123', '111-0124', '2024-12-01', 'Sr.'),
	(10, 'Cliente1', 'Apellido1', 'cliente1@example.com', 'Direccion 1', 1, '555-9100', '555-3713', '2024-06-12', 'Sra.'),
	(11, 'Cliente2', 'Apellido2', 'cliente2@example.com', 'Direccion 2', 2, '555-5452', '555-0623', '2024-07-04', 'Sr.'),
	(12, 'Cliente3', 'Apellido3', 'cliente3@example.com', 'Direccion 3', 8, '555-1174', '555-7680', '2024-03-19', 'Sra.'),
	(13, 'Cliente4', 'Apellido4', 'cliente4@example.com', 'Direccion 4', 2, '555-6687', '555-6980', '2024-02-14', 'Sr.'),
	(14, 'Cliente5', 'Apellido5', 'cliente5@example.com', 'Direccion 5', 2, '555-9175', '555-0498', '2024-04-14', 'Sra.'),
	(15, 'Cliente6', 'Apellido6', 'cliente6@example.com', 'Direccion 6', 2, '555-8953', '555-9384', '2024-05-14', 'Sr.'),
	(16, 'Cliente7', 'Apellido7', 'cliente7@example.com', 'Direccion 7', 1, '555-6532', '555-0859', '2024-03-01', 'Sra.'),
	(17, 'Cliente8', 'Apellido8', 'cliente8@example.com', 'Direccion 8', 1, '555-9726', '555-7140', '2024-02-14', 'Sr.'),
	(18, 'Cliente9', 'Apellido9', 'cliente9@example.com', 'Direccion 9', 6, '555-8509', '555-3285', '2024-02-19', 'Sra.'),
	(19, 'Cliente10', 'Apellido10', 'cliente10@example.com', 'Direccion 10', 1, '555-8355', '555-0436', '2024-06-03', 'Sr.'),
	(20, 'Cliente11', 'Apellido11', 'cliente11@example.com', 'Direccion 11', 8, '555-6998', '555-5125', '2024-06-20', 'Sra.'),
	(21, 'Cliente12', 'Apellido12', 'cliente12@example.com', 'Direccion 12', 5, '555-1935', '555-4490', '2024-10-13', 'Sr.'),
	(22, 'Cliente13', 'Apellido13', 'cliente13@example.com', 'Direccion 13', 8, '555-4947', '555-8208', '2024-12-19', 'Sra.'),
	(23, 'Cliente14', 'Apellido14', 'cliente14@example.com', 'Direccion 14', 3, '555-7218', '555-6287', '2024-08-18', 'Sr.'),
	(24, 'Cliente15', 'Apellido15', 'cliente15@example.com', 'Direccion 15', 1, '555-4568', '555-9990', '2024-01-28', 'Sra.'),
	(25, 'Cliente16', 'Apellido16', 'cliente16@example.com', 'Direccion 16', 7, '555-4224', '555-8302', '2024-02-18', 'Sr.'),
	(26, 'Cliente17', 'Apellido17', 'cliente17@example.com', 'Direccion 17', 8, '555-1477', '555-7806', '2024-12-25', 'Sra.'),
	(27, 'Cliente18', 'Apellido18', 'cliente18@example.com', 'Direccion 18', 4, '555-1951', '555-7323', '2024-12-13', 'Sr.'),
	(28, 'Cliente19', 'Apellido19', 'cliente19@example.com', 'Direccion 19', 6, '555-9133', '555-4867', '2024-03-03', 'Sra.'),
	(29, 'Cliente20', 'Apellido20', 'cliente20@example.com', 'Direccion 20', 8, '555-7789', '555-0120', '2024-01-20', 'Sr.'),
	(30, 'Cliente21', 'Apellido21', 'cliente21@example.com', 'Direccion 21', 6, '555-9514', '555-5386', '2024-07-21', 'Sra.'),
	(31, 'Cliente22', 'Apellido22', 'cliente22@example.com', 'Direccion 22', 3, '555-1317', '555-5394', '2024-07-24', 'Sr.'),
	(32, 'Cliente23', 'Apellido23', 'cliente23@example.com', 'Direccion 23', 5, '555-0999', '555-8333', '2024-11-09', 'Sra.'),
	(33, 'Cliente24', 'Apellido24', 'cliente24@example.com', 'Direccion 24', 5, '555-3653', '555-1044', '2024-11-25', 'Sr.'),
	(34, 'Cliente25', 'Apellido25', 'cliente25@example.com', 'Direccion 25', 7, '555-5903', '555-5262', '2024-10-12', 'Sra.'),
	(35, 'Cliente26', 'Apellido26', 'cliente26@example.com', 'Direccion 26', 1, '555-9959', '555-8810', '2024-09-25', 'Sr.'),
	(36, 'Cliente27', 'Apellido27', 'cliente27@example.com', 'Direccion 27', 8, '555-5200', '555-6878', '2024-06-12', 'Sra.'),
	(37, 'Cliente28', 'Apellido28', 'cliente28@example.com', 'Direccion 28', 1, '555-0937', '555-4171', '2024-04-25', 'Sr.'),
	(38, 'Cliente29', 'Apellido29', 'cliente29@example.com', 'Direccion 29', 4, '555-9064', '555-1993', '2024-10-23', 'Sra.'),
	(39, 'Cliente30', 'Apellido30', 'cliente30@example.com', 'Direccion 30', 1, '555-2172', '555-7336', '2024-10-08', 'Sr.'),
	(40, 'Cliente31', 'Apellido31', 'cliente31@example.com', 'Direccion 31', 3, '555-1580', '555-7075', '2024-11-01', 'Sra.'),
	(41, 'Cliente32', 'Apellido32', 'cliente32@example.com', 'Direccion 32', 7, '555-3381', '555-3369', '2024-03-02', 'Sr.'),
	(42, 'Cliente33', 'Apellido33', 'cliente33@example.com', 'Direccion 33', 6, '555-4230', '555-0498', '2024-05-19', 'Sra.'),
	(43, 'Cliente34', 'Apellido34', 'cliente34@example.com', 'Direccion 34', 7, '555-8148', '555-6341', '2024-10-28', 'Sr.'),
	(44, 'Cliente35', 'Apellido35', 'cliente35@example.com', 'Direccion 35', 4, '555-1311', '555-2658', '2024-09-21', 'Sra.'),
	(45, 'Cliente36', 'Apellido36', 'cliente36@example.com', 'Direccion 36', 5, '555-3624', '555-0074', '2024-11-27', 'Sr.'),
	(46, 'Cliente37', 'Apellido37', 'cliente37@example.com', 'Direccion 37', 7, '555-7640', '555-4514', '2024-09-27', 'Sra.'),
	(47, 'Cliente38', 'Apellido38', 'cliente38@example.com', 'Direccion 38', 4, '555-8955', '555-0916', '2024-06-28', 'Sr.'),
	(48, 'Cliente39', 'Apellido39', 'cliente39@example.com', 'Direccion 39', 5, '555-2668', '555-5233', '2024-08-22', 'Sra.'),
	(49, 'Cliente40', 'Apellido40', 'cliente40@example.com', 'Direccion 40', 1, '555-9945', '555-6567', '2024-07-23', 'Sr.'),
	(50, 'Cliente41', 'Apellido41', 'cliente41@example.com', 'Direccion 41', 6, '555-1441', '555-4815', '2024-07-09', 'Sra.'),
	(51, 'Cliente42', 'Apellido42', 'cliente42@example.com', 'Direccion 42', 2, '555-8705', '555-6531', '2024-06-28', 'Sr.'),
	(52, 'Cliente43', 'Apellido43', 'cliente43@example.com', 'Direccion 43', 5, '555-0507', '555-4613', '2024-04-19', 'Sra.'),
	(53, 'Cliente44', 'Apellido44', 'cliente44@example.com', 'Direccion 44', 4, '555-2506', '555-8013', '2024-05-05', 'Sr.'),
	(54, 'Cliente45', 'Apellido45', 'cliente45@example.com', 'Direccion 45', 5, '555-3395', '555-9260', '2024-11-08', 'Sra.'),
	(55, 'Cliente46', 'Apellido46', 'cliente46@example.com', 'Direccion 46', 5, '555-9757', '555-1900', '2024-04-18', 'Sr.'),
	(56, 'Cliente47', 'Apellido47', 'cliente47@example.com', 'Direccion 47', 6, '555-6541', '555-2962', '2024-07-01', 'Sra.'),
	(57, 'Cliente48', 'Apellido48', 'cliente48@example.com', 'Direccion 48', 8, '555-7563', '555-8560', '2024-09-15', 'Sr.'),
	(58, 'Cliente49', 'Apellido49', 'cliente49@example.com', 'Direccion 49', 4, '555-5922', '555-7251', '2024-06-01', 'Sra.'),
	(59, 'Cliente50', 'Apellido50', 'cliente50@example.com', 'Direccion 50', 7, '555-7788', '555-5034', '2024-01-24', 'Sr.'),
	(60, 'Cliente51', 'Apellido51', 'cliente51@example.com', 'Direccion 51', 4, '555-9417', '555-4355', '2024-05-06', 'Sra.'),
	(61, 'Cliente52', 'Apellido52', 'cliente52@example.com', 'Direccion 52', 2, '555-7442', '555-0539', '2024-06-10', 'Sr.'),
	(62, 'Cliente53', 'Apellido53', 'cliente53@example.com', 'Direccion 53', 1, '555-9509', '555-7428', '2024-01-02', 'Sra.');

-- Dumping structure for table pemidb.tb_detalle_envios
DROP TABLE IF EXISTS `tb_detalle_envios`;
CREATE TABLE IF NOT EXISTS `tb_detalle_envios` (
  `id_detalle_envio` int(11) NOT NULL AUTO_INCREMENT,
  `id_envio` int(11) DEFAULT NULL,
  `medio_envio` enum('Tierra','Mar','Aire') DEFAULT NULL,
  `costo_envio` decimal(36,2) DEFAULT NULL,
  `impuesto_envio` decimal(36,2) DEFAULT NULL,
  `id_entidad` int(11) DEFAULT NULL,
  `cantidad_entidad` int(11) DEFAULT NULL,
  `direccion_envio` varchar(100) NOT NULL,
  PRIMARY KEY (`id_detalle_envio`),
  KEY `fk_envio_producto` (`id_envio`),
  KEY `fk_entidades_enviadas` (`id_entidad`),
  CONSTRAINT `fk_entidades_enviadas` FOREIGN KEY (`id_entidad`) REFERENCES `tb_entidades` (`id_entidad`),
  CONSTRAINT `fk_envio_producto` FOREIGN KEY (`id_envio`) REFERENCES `tb_envios` (`id_envio`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pemidb.tb_detalle_envios: ~66 rows (approximately)
INSERT IGNORE INTO `tb_detalle_envios` (`id_detalle_envio`, `id_envio`, `medio_envio`, `costo_envio`, `impuesto_envio`, `id_entidad`, `cantidad_entidad`, `direccion_envio`) VALUES
	(1, 1, 'Tierra', 100.00, 15.00, 1, 10, 'Calle 123, Ciudad A'),
	(2, 2, 'Mar', 200.00, 30.00, 2, 5, 'Avenida 456, Ciudad B'),
	(3, 3, 'Aire', 300.00, 45.00, 3, 8, 'Boulevard 789, Ciudad C'),
	(4, 4, 'Tierra', 150.00, 22.50, 4, 12, 'Carretera 012, Ciudad D'),
	(5, 5, 'Mar', 250.00, 37.50, 5, 6, 'Paseo 345, Ciudad E'),
	(6, 6, 'Aire', 350.00, 52.50, 6, 9, 'Plaza 678, Ciudad F'),
	(7, 7, 'Tierra', 180.00, 27.00, 7, 7, 'Sendero 901, Ciudad G'),
	(8, 8, 'Mar', 280.00, 42.00, 8, 4, 'Puente 234, Ciudad H'),
	(16, 16, 'Tierra', 10.00, 1.50, 16, 10, 'Dirección A'),
	(17, 17, 'Mar', 15.00, 2.00, 17, 5, 'Dirección B'),
	(18, 18, 'Tierra', 12.00, 1.80, 18, 8, 'Dirección C'),
	(19, 19, 'Aire', 14.00, 2.20, 19, 7, 'Dirección D'),
	(20, 20, 'Aire', 16.00, 2.50, 20, 9, 'Dirección E'),
	(21, 21, 'Tierra', 10.00, 1.50, 21, 6, 'Dirección F'),
	(22, 22, 'Aire', 18.00, 2.70, 22, 11, 'Dirección G'),
	(23, 23, 'Mar', 13.00, 1.90, 18, 10, 'Dirección H'),
	(24, 24, 'Mar', 15.00, 2.10, 19, 12, 'Dirección I'),
	(25, 25, 'Mar', 19.00, 2.80, 20, 14, 'Dirección J'),
	(26, 26, 'Tierra', 17.00, 2.60, 21, 13, 'Dirección K'),
	(28, 2, 'Mar', 200.00, 30.75, 2, 5, 'Avenida 456, Ciudad B'),
	(29, 3, 'Aire', 300.00, 45.75, 3, 8, 'Boulevard 789, Ciudad C'),
	(30, 4, 'Tierra', 155.00, 23.25, 4, 12, 'Carretera 012, Ciudad D'),
	(31, 5, 'Mar', 255.00, 38.25, 5, 6, 'Paseo 345, Ciudad E'),
	(32, 6, 'Aire', 350.00, 53.25, 6, 9, 'Plaza 678, Ciudad F'),
	(33, 7, 'Tierra', 180.00, 27.75, 7, 7, 'Sendero 901, Ciudad G'),
	(34, 8, 'Mar', 280.00, 42.75, 8, 4, 'Puente 234, Ciudad H'),
	(35, 9, 'Tierra', 110.00, 16.50, 1, 15, 'Calle 234, Ciudad I'),
	(36, 10, 'Mar', 200.00, 31.50, 2, 6, 'Avenida 567, Ciudad J'),
	(37, 11, 'Aire', 300.00, 46.50, 3, 9, 'Boulevard 890, Ciudad K'),
	(38, 12, 'Tierra', 160.00, 24.00, 4, 13, 'Carretera 345, Ciudad L'),
	(39, 13, 'Mar', 260.00, 39.00, 5, 7, 'Paseo 678, Ciudad M'),
	(40, 14, 'Aire', 350.00, 54.00, 6, 10, 'Plaza 901, Ciudad N'),
	(41, 15, 'Tierra', 180.00, 28.50, 7, 8, 'Sendero 012, Ciudad O'),
	(42, 16, 'Mar', 280.00, 43.50, 8, 5, 'Puente 345, Ciudad P'),
	(43, 17, 'Tierra', 115.00, 17.25, 1, 20, 'Calle 345, Ciudad Q'),
	(44, 18, 'Mar', 200.00, 32.25, 2, 7, 'Avenida 678, Ciudad R'),
	(45, 19, 'Aire', 300.00, 47.25, 3, 10, 'Boulevard 123, Ciudad S'),
	(46, 20, 'Tierra', 160.00, 24.75, 4, 14, 'Carretera 456, Ciudad T'),
	(47, 21, 'Mar', 265.00, 39.75, 5, 8, 'Paseo 789, Ciudad U'),
	(48, 22, 'Aire', 350.00, 54.75, 6, 11, 'Plaza 234, Ciudad V'),
	(49, 23, 'Tierra', 180.00, 29.25, 7, 9, 'Sendero 345, Ciudad W'),
	(50, 24, 'Mar', 280.00, 44.25, 8, 6, 'Puente 678, Ciudad X'),
	(51, 25, 'Tierra', 120.00, 18.00, 1, 25, 'Calle 456, Ciudad Y'),
	(52, 26, 'Mar', 200.00, 33.00, 2, 9, 'Avenida 789, Ciudad Z'),
	(53, 27, 'Aire', 300.00, 48.00, 3, 11, 'Boulevard 234, Ciudad A1'),
	(54, 28, 'Tierra', 160.00, 25.50, 4, 15, 'Carretera 567, Ciudad B1'),
	(55, 29, 'Mar', 270.00, 40.50, 5, 10, 'Paseo 012, Ciudad C1'),
	(56, 30, 'Aire', 350.00, 55.50, 6, 12, 'Plaza 345, Ciudad D1'),
	(57, 31, 'Tierra', 180.00, 30.00, 7, 10, 'Sendero 678, Ciudad E1'),
	(58, 32, 'Mar', 280.00, 45.00, 8, 7, 'Puente 789, Ciudad F1'),
	(59, 33, 'Tierra', 125.00, 18.75, 1, 30, 'Calle 567, Ciudad G1'),
	(60, 34, 'Mar', 200.00, 33.75, 2, 11, 'Avenida 012, Ciudad H1'),
	(61, 35, 'Aire', 300.00, 48.75, 3, 13, 'Boulevard 345, Ciudad I1'),
	(62, 36, 'Tierra', 160.00, 26.25, 4, 16, 'Carretera 678, Ciudad J1'),
	(63, 37, 'Mar', 275.00, 41.25, 5, 12, 'Paseo 123, Ciudad K1'),
	(64, 38, 'Aire', 350.00, 56.25, 6, 14, 'Plaza 456, Ciudad L1'),
	(65, 39, 'Tierra', 180.00, 30.75, 7, 11, 'Sendero 789, Ciudad M1'),
	(66, 40, 'Mar', 280.00, 46.25, 8, 8, 'Puente 012, Ciudad N1'),
	(67, 41, 'Tierra', 130.00, 19.50, 1, 35, 'Calle 678, Ciudad O1'),
	(68, 42, 'Mar', 200.00, 34.50, 2, 13, 'Avenida 123, Ciudad P1'),
	(69, 43, 'Aire', 300.00, 49.50, 3, 15, 'Boulevard 456, Ciudad Q1'),
	(70, 44, 'Tierra', 160.00, 27.00, 4, 17, 'Carretera 789, Ciudad R1'),
	(71, 45, 'Mar', 280.00, 42.00, 5, 14, 'Paseo 234, Ciudad S1'),
	(72, 46, 'Aire', 350.00, 57.00, 6, 16, 'Plaza 567, Ciudad T1'),
	(73, 47, 'Tierra', 180.00, 31.50, 7, 12, 'Sendero 890, Ciudad U1'),
	(74, 48, 'Mar', 280.00, 46.50, 8, 9, 'Puente 345, Ciudad V1');

-- Dumping structure for table pemidb.tb_detalle_notificaciones
DROP TABLE IF EXISTS `tb_detalle_notificaciones`;
CREATE TABLE IF NOT EXISTS `tb_detalle_notificaciones` (
  `id_detalle_notificacion` int(11) NOT NULL AUTO_INCREMENT,
  `id_notificacion` int(11) DEFAULT NULL,
  `nombre` varchar(150) DEFAULT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `fecha_caducidad` datetime DEFAULT NULL,
  `factura` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id_detalle_notificacion`),
  KEY `fk_notis_entidades` (`id_notificacion`),
  CONSTRAINT `fk_notis_entidades` FOREIGN KEY (`id_notificacion`) REFERENCES `tb_notificaciones` (`id_notificacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pemidb.tb_detalle_notificaciones: ~0 rows (approximately)

-- Dumping structure for table pemidb.tb_empresas
DROP TABLE IF EXISTS `tb_empresas`;
CREATE TABLE IF NOT EXISTS `tb_empresas` (
  `id_empresa` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_empresa` varchar(150) NOT NULL,
  PRIMARY KEY (`id_empresa`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pemidb.tb_empresas: ~8 rows (approximately)
INSERT IGNORE INTO `tb_empresas` (`id_empresa`, `nombre_empresa`) VALUES
	(1, 'Empresa A'),
	(2, 'Empresa B'),
	(3, 'Empresa C'),
	(4, 'Empresa D'),
	(5, 'Empresa E'),
	(6, 'Empresa F'),
	(7, 'Empresa G'),
	(8, 'Empresa H');

-- Dumping structure for table pemidb.tb_entidades
DROP TABLE IF EXISTS `tb_entidades`;
CREATE TABLE IF NOT EXISTS `tb_entidades` (
  `id_entidad` int(11) NOT NULL AUTO_INCREMENT,
  `id_almacenamiento` int(11) DEFAULT NULL,
  `id_producto` int(11) DEFAULT NULL,
  `existencias` int(11) DEFAULT NULL,
  `estado` enum('Disponible','Agotado','No disponible') DEFAULT NULL,
  PRIMARY KEY (`id_entidad`),
  KEY `fk_almacenamiento` (`id_almacenamiento`),
  KEY `fk_entidad_almacenamiento` (`id_producto`),
  CONSTRAINT `fk_almacenamiento` FOREIGN KEY (`id_almacenamiento`) REFERENCES `tb_almacenamientos` (`id_almacenamiento`),
  CONSTRAINT `fk_entidad_almacenamiento` FOREIGN KEY (`id_producto`) REFERENCES `tb_productos` (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pemidb.tb_entidades: ~15 rows (approximately)
INSERT IGNORE INTO `tb_entidades` (`id_entidad`, `id_almacenamiento`, `id_producto`, `existencias`, `estado`) VALUES
	(1, 1, 1, 100, 'Disponible'),
	(2, 2, 2, 50, 'Agotado'),
	(3, 3, 3, 75, 'Disponible'),
	(4, 4, 4, 25, 'No disponible'),
	(5, 5, 5, 120, 'Disponible'),
	(6, 6, 6, 80, 'Agotado'),
	(7, 7, 7, 60, 'Disponible'),
	(8, 8, 8, 90, 'No disponible'),
	(16, 1, 16, 50, 'Disponible'),
	(17, 1, 17, 30, 'Disponible'),
	(18, 2, 18, 40, 'Disponible'),
	(19, 2, 19, 20, 'Disponible'),
	(20, 3, 20, 35, 'Disponible'),
	(21, 3, 21, 25, 'Disponible'),
	(22, 1, 22, 50, 'Disponible');

-- Dumping structure for table pemidb.tb_envios
DROP TABLE IF EXISTS `tb_envios`;
CREATE TABLE IF NOT EXISTS `tb_envios` (
  `id_envio` int(11) NOT NULL AUTO_INCREMENT,
  `estado_envio` enum('Entregado','Cancelado','Finalizado','Pendiente') DEFAULT 'Pendiente',
  `fecha_estimada` date NOT NULL,
  `numero_seguimiento` int(100) DEFAULT NULL,
  `etiqueta_edificacion` varchar(200) NOT NULL,
  `id_cliente` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_envio`),
  KEY `fk_cliente_envio` (`id_cliente`),
  CONSTRAINT `fk_cliente_envio` FOREIGN KEY (`id_cliente`) REFERENCES `tb_clientes` (`id_cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pemidb.tb_envios: ~66 rows (approximately)
INSERT IGNORE INTO `tb_envios` (`id_envio`, `estado_envio`, `fecha_estimada`, `numero_seguimiento`, `etiqueta_edificacion`, `id_cliente`) VALUES
	(1, 'Finalizado', '2024-08-10', 123456, 'Calle 123, Ciudad A', 1),
	(2, 'Cancelado', '2024-08-15', 234567, 'Avenida 456, Ciudad B', 2),
	(3, 'Finalizado', '2024-08-20', 345678, 'Boulevard 789, Ciudad C', 3),
	(4, 'Pendiente', '2024-08-25', 456789, 'Carretera 012, Ciudad D', 4),
	(5, 'Entregado', '2024-08-30', 567890, 'Paseo 345, Ciudad E', 5),
	(6, 'Cancelado', '2024-09-05', 678901, 'Plaza 678, Ciudad F', 6),
	(7, 'Finalizado', '2024-09-10', 789012, 'Sendero 901, Ciudad G', 7),
	(8, 'Pendiente', '2024-09-15', 890123, 'Puente 234, Ciudad H', 8),
	(16, 'Entregado', '2024-06-15', 789013, 'Edificación A', 1),
	(17, 'Entregado', '2024-07-20', 789011, 'Edificación B', 2),
	(18, 'Entregado', '2024-01-10', 789013, 'Edificación C', 3),
	(19, 'Entregado', '2024-02-15', 345671, 'Edificación D', 4),
	(20, 'Entregado', '2024-03-20', 345673, 'Edificación E', 5),
	(21, 'Entregado', '2024-04-25', 245678, 'Edificación F', 6),
	(22, 'Entregado', '2024-05-30', 345648, 'Edificación G', 7),
	(23, 'Entregado', '2024-09-05', 345618, 'Edificación H', 8),
	(24, 'Entregado', '2024-10-10', 345628, 'Edificación I', 1),
	(25, 'Entregado', '2024-11-15', 645678, 'Edificación J', 2),
	(26, 'Entregado', '2024-12-20', 645671, 'Edificación K', 3),
	(27, 'Entregado', '2024-01-15', 345673, 'Edificación Z', 1),
	(28, 'Entregado', '2024-02-20', 345671, 'Edificación K', 2),
	(29, 'Finalizado', '2024-03-10', 345674, 'Edificación A', 3),
	(30, 'Entregado', '2024-04-25', 345671, 'Edificación B', 4),
	(31, 'Entregado', '2024-05-30', 345644, 'Edificación V', 5),
	(32, 'Finalizado', '2024-06-15', 545674, 'Edificación K', 6),
	(33, 'Entregado', '2024-07-10', 445674, 'Edificación G', 7),
	(34, 'Entregado', '2024-08-05', 445634, 'Edificación Z', 8),
	(35, 'Finalizado', '2024-01-20', 345624, 'Edificación G', 2),
	(36, 'Entregado', '2024-02-25', 343624, 'Edificación K', 3),
	(37, 'Finalizado', '2024-03-30', 343124, 'Edificación K', 4),
	(38, 'Entregado', '2024-04-15', 343324, 'Edificación E', 5),
	(39, 'Entregado', '2024-05-20', 243624, 'Edificación A', 6),
	(40, 'Finalizado', '2024-06-25', 343614, 'Edificación A', 7),
	(41, 'Entregado', '2024-07-30', 343634, 'Edificación G', 8),
	(42, 'Entregado', '2024-08-15', 343674, 'Edificación K', 1),
	(43, 'Finalizado', '2024-01-30', 643674, 'Edificación V', 3),
	(44, 'Entregado', '2024-02-10', 643634, 'Edificación A', 4),
	(45, 'Finalizado', '2024-03-20', 647634, 'Edificación V', 5),
	(46, 'Entregado', '2024-04-30', 613634, 'Edificación A', 6),
	(47, 'Entregado', '2024-05-10', 643624, 'Edificación H', 7),
	(48, 'Finalizado', '2024-06-20', 643134, 'Edificación E', 8),
	(49, 'Entregado', '2024-07-15', 648134, 'Edificación E', 1),
	(50, 'Entregado', '2024-08-25', 843134, 'Edificación E', 2),
	(51, 'Finalizado', '2024-01-25', 813134, 'Edificación Z', 4),
	(52, 'Entregado', '2024-02-15', 823134, 'Edificación Z', 5),
	(53, 'Finalizado', '2024-03-25', 833134, 'Edificación G', 6),
	(54, 'Entregado', '2024-04-20', 853134, 'Edificación G', 7),
	(55, 'Entregado', '2024-05-25', 883134, 'Edificación G', 8),
	(56, 'Finalizado', '2024-06-30', 841134, 'Edificación K', 1),
	(57, 'Entregado', '2024-07-25', 911134, 'Edificación K', 2),
	(58, 'Entregado', '2024-08-10', 921134, 'Edificación A', 3),
	(59, 'Finalizado', '2024-01-10', 931134, 'Edificación V', 5),
	(60, 'Entregado', '2024-02-05', 941134, 'Edificación V', 6),
	(61, 'Finalizado', '2024-03-15', 951134, 'Edificación K', 7),
	(62, 'Entregado', '2024-04-05', 961134, 'Edificación V', 8),
	(63, 'Entregado', '2024-05-15', 971134, 'Edificación H', 1),
	(64, 'Finalizado', '2024-06-10', 981134, 'Edificación C', 2),
	(65, 'Entregado', '2024-07-05', 981134, 'Edificación H', 3),
	(66, 'Entregado', '2024-08-30', 991134, 'Edificación A', 4),
	(67, 'Finalizado', '2024-01-05', 211134, 'Edificación C', 6),
	(68, 'Entregado', '2024-02-28', 221134, 'Edificación E', 7),
	(69, 'Finalizado', '2024-03-18', 221134, 'Edificación B', 8),
	(70, 'Entregado', '2024-04-12', 231134, 'Edificación C', 1),
	(71, 'Entregado', '2024-05-14', 241134, 'Edificación C', 2),
	(72, 'Finalizado', '2024-06-28', 251134, 'Edificación C', 3),
	(73, 'Finalizado', '2024-06-28', 251134, 'Edificación C', 3);

-- Dumping structure for table pemidb.tb_notificaciones
DROP TABLE IF EXISTS `tb_notificaciones`;
CREATE TABLE IF NOT EXISTS `tb_notificaciones` (
  `id_notificacion` int(11) NOT NULL AUTO_INCREMENT,
  `estado_producto` varchar(50) DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_final` date DEFAULT NULL,
  `id_usuario` int(11) NOT NULL,
  PRIMARY KEY (`id_notificacion`),
  KEY `fk_id_usuario_noti` (`id_usuario`),
  CONSTRAINT `fk_id_usuario_noti` FOREIGN KEY (`id_usuario`) REFERENCES `tb_usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pemidb.tb_notificaciones: ~0 rows (approximately)

-- Dumping structure for table pemidb.tb_productos
DROP TABLE IF EXISTS `tb_productos`;
CREATE TABLE IF NOT EXISTS `tb_productos` (
  `id_producto` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_producto` varchar(200) NOT NULL,
  `descripcion_producto` varchar(200) NOT NULL,
  `impuesto_producto` decimal(24,2) NOT NULL,
  `imagen_producto` varchar(200) DEFAULT NULL,
  `precio_producto` decimal(36,2) NOT NULL,
  `costo_compra` decimal(36,2) DEFAULT NULL,
  `codigo_producto` int(11) NOT NULL,
  `id_categoria` int(11) NOT NULL,
  PRIMARY KEY (`id_producto`),
  KEY `fk_categoria_producto` (`id_categoria`),
  CONSTRAINT `fk_categoria_producto` FOREIGN KEY (`id_categoria`) REFERENCES `tb_categorias` (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pemidb.tb_productos: ~16 rows (approximately)
INSERT IGNORE INTO `tb_productos` (`id_producto`, `nombre_producto`, `descripcion_producto`, `impuesto_producto`, `imagen_producto`, `precio_producto`, `costo_compra`, `codigo_producto`, `id_categoria`) VALUES
	(1, 'Producto A', 'Descripción del Producto A', 15.00, 'imagen_a.jpg', 1750.00, 75.00, 123456, 1),
	(2, 'Producto B', 'Descripción del Producto B', 20.00, 'imagen_b.jpg', 3500.00, 150.00, 234567, 2),
	(3, 'Producto C', 'Descripción del Producto C', 18.00, 'imagen_c.jpg', 4100.00, 110.00, 345678, 3),
	(4, 'Producto D', 'Descripción del Producto D', 25.00, 'imagen_d.jpg', 3400.00, 190.00, 456789, 4),
	(5, 'Producto E', 'Descripción del Producto E', 22.00, 'imagen_e.jpg', 4800.00, 230.00, 567890, 5),
	(6, 'Producto F', 'Descripción del Producto F', 28.00, 'imagen_f.jpg', 6200.00, 270.00, 678901, 6),
	(7, 'Producto G', 'Descripción del Producto G', 30.00, 'imagen_g.jpg', 5000.00, 320.00, 789012, 7),
	(8, 'Producto H', 'Descripción del Producto H', 35.00, 'imagen_h.jpg', 6500.00, 370.00, 890123, 8),
	(9, 'Stanley', 'dadad', 124.00, 'default.png', 1414.00, 14.00, 141414, 1),
	(16, 'Producto A', 'Descripción del Producto A', 15.00, 'imagen_a.png', 700.00, 60.00, 123456, 1),
	(17, 'Producto B', 'Descripción del Producto B', 18.00, 'imagen_b.png', 950.00, 80.00, 789012, 1),
	(18, 'Producto C', 'Descripción del Producto C', 20.00, 'imagen_c.png', 1320.00, 120.00, 654321, 2),
	(19, 'Producto D', 'Descripción del Producto D', 22.00, 'imagen_d.png', 1640.00, 150.00, 321987, 2),
	(20, 'Producto E', 'Descripción del Producto E', 25.00, 'imagen_e.png', 1960.00, 180.00, 147852, 3),
	(21, 'Producto F', 'Descripción del Producto F', 18.00, 'imagen_f.png', 1100.00, 100.00, 963852, 3),
	(22, 'Producto G', 'Descripción del Producto G', 15.00, 'imagen_g.png', 780.00, 60.00, 753951, 1);

-- Dumping structure for table pemidb.tb_usuarios
DROP TABLE IF EXISTS `tb_usuarios`;
CREATE TABLE IF NOT EXISTS `tb_usuarios` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `imagen_usuario` varchar(200) DEFAULT NULL,
  `nombre` varchar(200) NOT NULL,
  `apellido` varchar(200) NOT NULL,
  `numero_telefono` varchar(60) NOT NULL,
  `cargo` tinyint(1) NOT NULL,
  `correo_electronico` varchar(200) NOT NULL,
  `contraseña` varchar(200) NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `correo_electronico` (`correo_electronico`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pemidb.tb_usuarios: ~1 rows (approximately)
INSERT IGNORE INTO `tb_usuarios` (`id_usuario`, `imagen_usuario`, `nombre`, `apellido`, `numero_telefono`, `cargo`, `correo_electronico`, `contraseña`) VALUES
	(1, NULL, 'Kenneth', 'Ramos', '8989-9898', 0, 'kenneth@gmail.com', '$2y$10$d/xoGWtEj7DNaMdlRe9JuujUKTPWZHj67drnsuUMhLe8mXDgORecG');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
