Enter password: **************
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 12
Server version: 8.0.43 MySQL Community Server - GPL

Copyright (c) 2000, 2025, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> CREATE DATABASE saboruam;
Query OK, 1 row affected (0.11 sec)

mysql> USE saboruam;
Database changed
mysql> CREATE TABLE Usuarios (
    ->     tipo_de_documento VARCHAR(20) NOT NULL,
    ->     numero_de_documento VARCHAR(20) PRIMARY KEY,
    ->     correo_electronico VARCHAR(100) NOT NULL UNIQUE,
    ->     nombre_completo VARCHAR(100) NOT NULL,
    ->     contrasena VARCHAR(100) NOT NULL
    -> );
Query OK, 0 rows affected (0.29 sec)

mysql> CREATE TABLE Lugares (
    ->     NIT VARCHAR(15) PRIMARY KEY,
    ->     nombre VARCHAR(100) NOT NULL,
    ->     tipo VARCHAR(50) NOT NULL,              
    ->     horario_atencion VARCHAR(100),
    ->     estado VARCHAR(20),                     
    ->     servicio_domicilio BOOLEAN,
    ->     numero_contacto_domicilio VARCHAR(20),
    ->     ubicacion VARCHAR(200)
    -> );
Query OK, 0 rows affected (0.05 sec)

mysql> CREATE TABLE Productos (
    ->     codigo INT AUTO_INCREMENT PRIMARY KEY,
    ->     nombre VARCHAR(100) NOT NULL,
    ->     precio DECIMAL(10,2) NOT NULL,
    ->     descripcion VARCHAR(200),
    ->    tipo_menu VARCHAR(50),
    ->    imagen VARCHAR(255));
Query OK, 0 rows affected (0.06 sec)

mysql> CREATE TABLE productos_lugares (
    lug_nit VARCHAR(15) NOT NULL,
    pro_cod INT NOT NULL,
    PRIMARY KEY (lug_nit, pro_cod),
    FOREIGN KEY (lug_nit) REFERENCES lugares(NIT)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (pro_cod) REFERENCES productos(codigo)
        ON DELETE CASCADE ON UPDATE CASCADE
);

mysql>CREATE TABLE consultas (
    usu_num VARCHAR(20),
    pro_cod INT,
    fecha_consulta DATETIME DEFAULT NOW(),
    PRIMARY KEY (usu_num, pro_cod),
    FOREIGN KEY (usu_num) REFERENCES usuarios(numero_de_documento)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (pro_cod) REFERENCES productos(codigo)
        ON DELETE CASCADE ON UPDATE CASCADE
);

