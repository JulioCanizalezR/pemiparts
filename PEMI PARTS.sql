DROP DATABASE IF EXISTS PemiDB;
CREATE DATABASE PemiDB;
USE PemiDB;
CREATE TABLE tb_usuarios(
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    imagen_usuario varchar(200),
    nombre VARCHAR(200) NOT NULL,
    apellido VARCHAR(200) NOT NULL,
    numero_telefono VARCHAR(60) NOT NULL, 
    cargo BOOLEAN NOT NULL,
    correo_electronico VARCHAR(200) UNIQUE NOT NULL,
    contraseña VARCHAR(200) NOT NULL
);
 
SELECT * FROM tb_usuarios
 
INSERT INTO tb_usuarios ( id_usuario, `nombre`, `apellido`, `numero_telefono`, `cargo`, `correo_electronico`, `contraseña`) 
VALUES (1,  'Kenneth', 'Ramos', '8989-9898', 0, 'kenneth@gmail.com', '$2y$10$d/xoGWtEj7DNaMdlRe9JuujUKTPWZHj67drnsuUMhLe8mXDgORecG');
-- Falta pantalla de SCRUD
CREATE TABLE tb_categorias(
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200)  
);
 
CREATE TABLE tb_productos(
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre_producto VARCHAR(200) NOT NULL,
    descripcion_producto VARCHAR(200) NOT NULL,
    impuesto_producto DECIMAL(24,2) NOT NULL,
    imagen_producto VARCHAR(200),
    precio_producto DECIMAL(36,2) NOT NULL,
    costo_compra DECIMAL(36, 2),
    codigo_producto INT NOT NULL,
    id_categoria INT NOT NULL,
    CONSTRAINT fk_categoria_producto FOREIGN KEY (id_categoria)
    REFERENCES tb_categorias(id_categoria)
);
 
-- Falta pantalla de SCRUD
CREATE TABLE tb_almacenamientos(
    id_almacenamiento INT AUTO_INCREMENT PRIMARY KEY,
    nombre_almacenamiento VARCHAR(200),
    tiempo_inicial DATE,
    tiempo_final DATE
);


 
-- Falta pantalla de SCRUD
CREATE TABLE tb_entidades(
    id_entidad INT AUTO_INCREMENT PRIMARY KEY,
    id_almacenamiento INT,
    CONSTRAINT fk_almacenamiento FOREIGN KEY (id_almacenamiento)
    REFERENCES tb_almacenamientos(id_almacenamiento),
    id_producto INT,
    CONSTRAINT fk_entidad_almacenamiento FOREIGN KEY (id_producto)
    REFERENCES tb_productos(id_producto),
    existencias INT,
    estado ENUM('Disponible', 'Agotado', 'No disponible')
);
 
CREATE TABLE tb_empresas(
    id_empresa INT AUTO_INCREMENT PRIMARY KEY,
    nombre_empresa VARCHAR(150) NOT NULL
);
 
-- Falta pantalla de SCRUD
CREATE TABLE tb_clientes(
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre_cliente VARCHAR(200) NOT NULL,
    apellido_cliente VARCHAR(200) NOT NULL, 
    correo_electronico_cliente VARCHAR(200) UNIQUE NOT NULL,
    direccion_cliente VARCHAR(200) NOT NULL,
    id_empresa INT,
    CONSTRAINT fk_empresa_cliente FOREIGN KEY (id_empresa)
    REFERENCES tb_empresas(id_empresa),
    numero_telefono_cliente VARCHAR(200) NOT NULL,
    fax_cliente VARCHAR(200) NOT NULL,
    fecha_registro_cliente DATE NOT NULL,
    sufijo_cliente VARCHAR(150) NOT NULL
);
 
-- Falta pantalla de SCRUD
CREATE TABLE tb_envios(
    id_envio INT AUTO_INCREMENT PRIMARY KEY,
    estado_envio ENUM('Entregado','Cancelado','Finalizado','Pendiente') DEFAULT 'Pendiente',
    fecha_estimada DATE NOT NULL,
    numero_seguimiento INT(100),
    etiqueta_edificacion VARCHAR(200) NOT NULL,
    id_cliente INT,
    CONSTRAINT fk_cliente_envio FOREIGN KEY (id_cliente)
    REFERENCES tb_clientes(id_cliente)
);

CREATE TABLE tb_detalle_envios(
    id_detalle_envio INT AUTO_INCREMENT PRIMARY KEY,
    id_envio INT,
    CONSTRAINT fk_envio_producto FOREIGN KEY (id_envio)
    REFERENCES tb_envios(id_envio),
    medio_envio ENUM('Tierra', 'Mar', 'Aire'),
    costo_envio DECIMAL(36,2),
    impuesto_envio DECIMAL(36,2),
    id_entidad INT,
    CONSTRAINT fk_entidades_enviadas FOREIGN KEY (id_entidad)
    REFERENCES tb_entidades(id_entidad),
    cantidad_entidad INT,
    direccion_envio VARCHAR(100) NOT NULL
);

CREATE TABLE tb_notificaciones(
	id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
	estado_producto VARCHAR(50), -- estado_notificacion ENUM('Almacenes temporales','Almacenes duraderos','Chat de empleados')
	fecha_inicio DATE, -- fecha registro DATETIME DEFAULT NOW()
	fecha_final DATE, -- detalle
    id_usuario INT NOT NULL,
    CONSTRAINT fk_id_usuario_noti FOREIGN KEY (id_usuario)
    REFERENCES tb_usuarios(id_usuario)
);
 
CREATE TABLE tb_detalle_notificaciones(
    id_detalle_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_notificacion INT,
    CONSTRAINT fk_notis_entidades FOREIGN KEY (id_notificacion)
    REFERENCES tb_notificaciones(id_notificacion),
	nombre VARCHAR(150), -- detalle
	descripcion VARCHAR(200), -- detalle
    fecha_caducidad DATETIME NULL,
    factura VARCHAR(200) NULL
);
 
CREATE TABLE tb_chat(
    id_chat INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario_emisor INT,
    CONSTRAINT fk_id_usuario_emisor FOREIGN KEY (id_usuario_emisor)
    REFERENCES tb_usuarios(id_usuario),
    id_usuario_receptor INT,
    CONSTRAINT fk_id_usuario_receptor FOREIGN KEY (id_usuario_receptor)
    REFERENCES tb_usuarios(id_usuario),
    mensaje VARCHAR(250),
    fecha_registro DATE DEFAULT NOW()
);
 
-- Inserciones en la tabla tb_usuarios

-- Inserciones en la tabla tb_categorias
INSERT INTO tb_categorias (id_categoria, nombre) VALUES
(1, 'Electrónica'),
(2, 'Ropa'),
(3, 'Alimentos'),
(4, 'Juguetes'),
(5, 'Libros');

-- Inserciones en la tabla tb_productos
INSERT INTO tb_productos (id_producto, nombre_producto, descripcion_producto , impuesto_producto, imagen_producto, precio_producto, costo_compra, codigo_producto, id_categoria) VALUES
(1, 'Laptop', 'Portátil de alta gama', 15.00, 'laptop.jpg', 1500.00, 1200.00, 1001, 1),
(2, 'Camiseta', 'Camiseta de algodón', 10.00, 'camiseta.jpg', 20.00, 5.00, 2001, 2),
(3, 'Pizza', 'Pizza de pepperoni', 8.00, 'pizza.jpg', 12.00, 4.00, 3001, 3),
(4, 'Muñeca', 'Muñeca de trapo', 5.00, 'muneca.jpg', 25.00, 10.00, 4001, 4),
(5, 'Libro', 'Libro de aventuras', 12.00, 'libro.jpg', 30.00, 15.00, 5001, 5);

-- Inserciones en la tabla tb_almacenamientos
INSERT INTO tb_almacenamientos (id_almacenamiento, nombre_almacenamiento, tiempo_inicial, tiempo_final) VALUES
(1, 'Almacén Principal', '08:00:00', '18:00:00'),
(2, 'Almacén Secundario', '09:00:00', '17:00:00'),
(3, 'Depósito Norte', '07:00:00', '15:00:00'),
(4, 'Depósito Sur', '10:00:00', '20:00:00'),
(5, 'Bodega Central', '06:00:00', '22:00:00');

-- Inserciones en la tabla tb_entidades
INSERT INTO tb_entidades (id_entidad, id_almacenamiento, id_producto, existencias, estado) VALUES
(1, 1, 1, 100, 'Disponible'),
(2, 2, 2, 50, 'Disponible'),
(3, 3, 3, 0, 'Agotado'),
(4, 4, 4, 30, 'Disponible'),
(5, 5, 5, 10, 'No disponible');

-- Inserciones en la tabla tb_empresas
INSERT INTO tb_empresas (id_empresa, nombre_empresa) VALUES
(1, 'Tech Solutions'),
(2, 'Fashion Hub'),
(3, 'Foodies Inc.'),
(4, 'Toy World'),
(5, 'Book Nook');

-- Inserciones en la tabla tb_clientes
INSERT INTO tb_clientes (id_cliente, nombre_cliente, apellido_cliente, correo_electronico_cliente, direccion_cliente, id_empresa, numero_telefono_cliente, fax_cliente, fecha_registro_cliente, sufijo_cliente) VALUES
(1, 'Pedro', 'Ramírez', 'pedro@gmail.com', 'Calle Falsa 123', 1, '1234-5678', '1234-5679', '2023-01-01', 'Sr.'),
(2, 'María', 'López', 'maria@gmail.com', 'Avenida Siempre Viva 456', 2, '2345-6789', '2345-6790', '2023-02-01', 'Sra.'),
(3, 'Juan', 'Pérez', 'juan@gmail.com', 'Boulevard de los Sueños 789', 3, '3456-7890', '3456-7891', '2023-03-01', 'Sr.'),
(4, 'Ana', 'García', 'ana@gmail.com', 'Calle del Sol 101', 4, '4567-8901', '4567-8902', '2023-04-01', 'Sra.'),
(5, 'Luis', 'Martínez', 'luis@gmail.com', 'Plaza Central 202', 5, '5678-9012', '5678-9013', '2023-05-01', 'Sr.');

-- Inserciones en la tabla tb_envios
INSERT INTO tb_envios (id_envio, estado_envio, fecha_estimada, numero_seguimiento, etiqueta_edificacion, id_cliente) VALUES
(1, 'Pendiente', '2023-06-01', 10001, 'Edificio A', 1),
(2, 'Entregado', '2023-06-05', 10002, 'Edificio B', 2),
(3, 'Cancelado', '2023-06-10', 10003, 'Edificio C', 3),
(4, 'Finalizado', '2023-06-15', 10004, 'Edificio D', 4),
(5, 'Pendiente', '2023-06-20', 10005, 'Edificio E', 5);

-- Inserciones en la tabla tb_detalle_envios
INSERT INTO tb_detalle_envios (id_detalle_envio, id_envio, medio_envio, costo_envio, impuesto_envio, id_entidad, cantidad_entidad, direccion_envio) VALUES
(1, 1, 'Tierra', 15.00, 1.50, 1, 10, 'Calle Falsa 123'),
(2, 2, 'Mar', 25.00, 2.50, 2, 5, 'Avenida Siempre Viva 456'),
(3, 3, 'Aire', 35.00, 3.50, 3, 15, 'Boulevard de los Sueños 789'),
(4, 4, 'Tierra', 45.00, 4.50, 4, 20, 'Calle del Sol 101'),
(5, 5, 'Mar', 55.00, 5.50, 5, 25, 'Plaza Central 202');

-- Inserciones en la tabla tb_notificaciones
INSERT INTO tb_notificaciones (id_notificacion, estado_producto, fecha_inicio, fecha_final, id_usuario) VALUES
(1, 'Almacenes temporales', '2023-01-01', '2023-01-31', 1),
(2, 'Almacenes duraderos', '2023-02-01', '2023-02-28', 2),
(3, 'Chat de empleados', '2023-03-01', '2023-03-31', 3),
(4, 'Almacenes temporales', '2023-04-01', '2023-04-30', 4),
(5, 'Almacenes duraderos', '2023-05-01', '2023-05-31', 5);

-- Inserciones en la tabla tb_detalle_notificaciones
INSERT INTO tb_detalle_notificaciones (id_detalle_notificacion, id_notificacion, nombre, descripcion, fecha_caducidad, factura) VALUES
(1, 1, 'Aviso de Almacén Temporal', 'Los productos estarán en el almacén temporal hasta fin de mes', '2023-01-31 23:59:59', NULL),
(2, 2, 'Aviso de Almacén Duradero', 'Revisar inventario en almacén duradero', '2023-02-