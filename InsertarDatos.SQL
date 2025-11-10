
--  Insertar datos de prueba en USUARIOS
INSERT INTO usuarios VALUES
('CC', '1023456', 'Maribel@gmail.com', 'Maribel Ceballos', '1234567'),
('CC', '10245678', 'mariapaz@gamil.com', 'Maria Paz Puerta', '123456'),
('CC', '10602979', 'eliza@gmail.com', 'Elizabeth Meneses', '1234567'),
('CC', '1060588888', 'luisa@gmail.com', 'Luisa', '123444'),
('CC', '1090456', 'marcela123@gmail.com', 'Marcela', '12345');

--  Insertar datos de prueba en LUGARES
INSERT INTO lugares VALUES
('10020', 'los paisitas', 'Tienda', '7:00 am a 8:00 pm', 'Activo', 1, '32444788', 'Al frente fundadores', 'lunes a viernes'),
('123-092', 'Maria', 'Tienda', '7:00 am a 8:00 pm', 'Activo', 0, NULL, 'sacatin', 'lunes a viernes'),
('1287', 'Maria', 'Tienda', '7:00 am a 8:00 pm', 'Activo', 1, '3244634115', 'al frente de la u', 'Lunes a viernes'),
('2335', 'ubiely', 'Restaurante', '7:00 am a 8:00 pm', 'Activo', 1, '3244634115', 'al frente de la u', 'Lunes a viernes');

--  Insertar datos de prueba en PRODUCTOS
INSERT INTO productos VALUES
('BOM56', 'Bomba de Chocolate', 'Pastel relleno de chocolate', 'Postres', 'bomba.jpg'),
('EMP11', 'Empanada de carne', 'Empanada tradicional con ají', 'Snacks', 'empanada.jpg'),
('PA24', 'Pan de bono', 'Pan de bono artesanal', 'Panadería', 'pandebono.jpg'),
('PONYMIN12', 'Pony Malta mini', 'Bebida malteada 330ml', 'Bebidas', 'pony.jpg'),
('SAND5678', 'Sandwich de pollo', 'Pan con pollo y queso', 'Comida rápida', 'sandwich.jpg'),
('CAFE23', 'Café negro', 'Taza de café mediana', 'Bebidas', 'cafe.jpg'),
('CHOJUM', 'Chocojumbo', 'Galleta cubierta de chocolate', 'Snacks', 'chocojumbo.jpg'),
('GRA11', 'Granizado', 'Bebida fría sabor fresa', 'Bebidas', 'granizado.jpg'),
('PAS45', 'Pastelito', 'Pastel de pollo', 'Panadería', 'pastelito.jpg'),
('PL20', 'Plátano maduro', 'Frito con queso', 'Comida típica', 'platano.jpg'),
('PAP24', 'Papas fritas', 'Porción de papas medianas', 'Snacks', 'papas.jpg'),
('COCA12', 'Coca-Cola', 'Bebida gaseosa 400ml', 'Bebidas', 'coca.jpg'),
('EJE23', 'Ejecutivo del día', 'Arroz, carne, ensalada y jugo', 'Almuerzos', 'ejecutivo.jpg');

--  Insertar datos de prueba en PRODUCTOS_LUGARES
INSERT INTO productos_lugares VALUES
('10020', 'BOM56', 'Disponible', 200.00, 1),
('10020', 'EMP11', 'Disponible', 2.00, 5),
('10020', 'PA24', 'Disponible', 2000.00, 9),
('10020', 'PONYMIN12', 'undefined', 2500.00, 1),
('10020', 'SAND5678', 'Disponible', 4000.00, 11),
('123-092', 'CAFE23', 'No disponible', 1500.00, 0),
('123-092', 'CHOJUM', 'undefined', 2500.00, 2),
('123-092', 'GRA11', 'Disponible', 9000.00, 9),
('123-092', 'PAS45', 'undefined', 1500.00, 0),
('123-092', 'PL20', 'Disponible', 3000.00, 10),
('1287', 'PAP24', 'Disponible', 4000.00, 3),
('2335', 'COCA12', 'Disponible', 4000.00, 1),
('2335', 'EJE23', 'Disponible', 12000.00, 5);

--  Insertar datos de prueba en CONSULTAS
INSERT INTO consultas (USU_NUM, PRO_COD) VALUES
('1023456', 'EMP11'),
('10245678', 'PA24'),
('10602979', 'PONYMIN12'),
('1090456', 'COCA12');


