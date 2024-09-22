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

-- Data exporting was unselected.

-- Dumping structure for table pemidb.tb_categorias
DROP TABLE IF EXISTS `tb_categorias`;
CREATE TABLE IF NOT EXISTS `tb_categorias` (
  `id_categoria` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

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

-- Data exporting was unselected.

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

-- Data exporting was unselected.

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

-- Data exporting was unselected.

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

-- Data exporting was unselected.

-- Dumping structure for table pemidb.tb_empresas
DROP TABLE IF EXISTS `tb_empresas`;
CREATE TABLE IF NOT EXISTS `tb_empresas` (
  `id_empresa` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_empresa` varchar(150) NOT NULL,
  PRIMARY KEY (`id_empresa`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

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
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

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

-- Data exporting was unselected.

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

-- Data exporting was unselected.

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

-- Data exporting was unselected.

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

-- Data exporting was unselected.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
