-- ==========================================
-- SCRIPT DE BASE DE DATOS SABORUAM
-- ==========================================

-- Crear base de datos

CREATE DATABASE saboruam;
USE saboruam;

--  Crear tabla USUARIOS
CREATE TABLE usuarios (
  tipo_de_documento VARCHAR(20) NOT NULL,
  numero_de_documento VARCHAR(20) NOT NULL PRIMARY KEY,
  correo_electronico VARCHAR(100) NOT NULL UNIQUE,
  nombre_completo VARCHAR(100) NOT NULL,
  contrasena VARCHAR(100) NOT NULL
);

--  Crear tabla LUGARES
CREATE TABLE lugares (
  NIT VARCHAR(15) NOT NULL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  horario_atencion VARCHAR(100),
  estado VARCHAR(20),
  servicio_domicilio TINYINT(1),
  numero_contacto_domicilio VARCHAR(20),
  ubicacion VARCHAR(200),
  dias VARCHAR(50)
);

--  Crear tabla PRODUCTOS
CREATE TABLE productos (
  codigo VARCHAR(10) NOT NULL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(200),
  tipo_menu VARCHAR(50),
  imagen VARCHAR(255)
);

--  Crear tabla PRODUCTOS_LUGARES
CREATE TABLE productos_lugares (
  lug_nit VARCHAR(15) NOT NULL,
  pro_cod VARCHAR(10) NOT NULL,
  estado VARCHAR(20) DEFAULT 'Disponible',
  precio DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  PRIMARY KEY (lug_nit, pro_cod),
  FOREIGN KEY (lug_nit) REFERENCES lugares(NIT),
  FOREIGN KEY (pro_cod) REFERENCES productos(codigo)
);

--  Crear tabla CONSULTAS
CREATE TABLE consultas (
  CON_ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  USU_NUM VARCHAR(20) NOT NULL,
  PRO_COD VARCHAR(10) NOT NULL,
  FECHA_CONSULTA DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (USU_NUM) REFERENCES usuarios(numero_de_documento),
  FOREIGN KEY (PRO_COD) REFERENCES productos(codigo)
);
