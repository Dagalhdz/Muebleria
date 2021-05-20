use Muebleria;
Select * from Productos;
select * from Categorias_Productos
select * from Materiales
select * from Colores

INSERT INTO Colores (color) Values ('Negro'), ('Blanco')

INSERT INTO Categorias_Productos(nombre, descripcion) VALUES 
('Cocina','Muebles que pertenecen a la cocina ejemplo mesas, sillas'),
('Cuarto Habitacion','Muebles que pertenecen a la habitacion ejemplo cama, armario')

INSERT INTO Materiales(material, descripcion) VALUES
('Madera', 'Es un material natural, flexible y resistente '),
('Metal', 'Tales como el aluminio, el acero, el hierro o la chapa galvanizada')

INSERT INTO Productos VALUES
(1, 'Mesa con silla', 3000.00, 1, 1, 1, 20, 'Comedor París Mesa De Madera Mas 4 Personas Sillas Uso Rudo Restaurante Bar Sin Barniz Hogar Muebles Vanely Desayunador'),
(2, 'Base Cama Urban Queen', 3847.00, 2, 1, 2, 40, 'Disfruta de un profundo sueño con nuestra increíble Recamara Urban, su calidad de construcción combinada con una atención a detalle rigurosa hace de esta Recamara una de las mejores compras que podrás hacer, y por supuesto a los mejores precios!')


CREATE PROCEDURE procedure_getAllProducts
AS
SELECT p.id, p.nombre, p.precio, cp.nombre categoria, m.material, c.color, p.existencia, p.descripcion FROM Productos p
INNER JOIN Categorias_Productos cp on cp.id = p.id_categoria
INNER JOIN Materiales m on m.id = p.id_material
INNER JOIN Colores c on c.id = p.id_color


CREATE PROCEDURE procedure_newProducto
   @id int,
   @nombre VARCHAR(50),
   @precio MONEY,
   @id_categoria TINYINT,
   @id_material TINYINT,
   @id_color TINYINT,
   @existencia int,
   @descripcion VARCHAR(500)
AS
BEGIN
  INSERT INTO Productos VALUES
  (@id, @nombre, @precio, @id_categoria, @id_material, @id_color, @existencia, @descripcion)
END

CREATE PROCEDURE procedure_DeleteProductById
   @id int
AS
BEGIN
   DELETE FROM Productos WHERE id = @id
END

CREATE PROCEDURE procedure_GetProductById
   @id int
AS
BEGIN
   SELECT * FROM Productos WHERE id = @id
END

CREATE PROCEDURE procedure_UpdateProduct
   @id int,
   @nombre VARCHAR(50),
   @precio MONEY,
   @id_categoria TINYINT,
   @id_material TINYINT,
   @id_color TINYINT,
   @existencia int,
   @descripcion VARCHAR(500)
AS
BEGIN
   UPDATE Productos
   set nombre = @nombre, precio = @precio, id_categoria = @id_categoria, id_material = @id_material, id_color = @id_color, existencia = @existencia, descripcion = @descripcion
   where id = @id
END

CREATE PROCEDURE procedure_DeleteColorById
   @id int
AS
BEGIN
   DELETE FROM Colores WHERE id = @id
END

CREATE PROCEDURE procedure_GetColorById
   @id int
AS
BEGIN
   SELECT * FROM Colores WHERE id = @id
END

CREATE PROCEDURE procedure_UpdateColor
   @id int,
   @color VARCHAR(30)
AS
BEGIN
   UPDATE Colores
   set color = @color
   where id = @id
END

CREATE PROCEDURE procedure_DeleteMaterialtById
   @id int
AS
BEGIN
   DELETE FROM Materiales WHERE id = @id
END

CREATE PROCEDURE procedure_newMaterial
   @material VARCHAR(30),
   @descripcion VARCHAR(100)
AS
BEGIN
  INSERT INTO Materiales (material, descripcion) VALUES
  (@material, @descripcion)
END

CREATE PROCEDURE procedure_UpdateMaterial
   @id int,
   @material VARCHAR(30),
   @descripcion VARCHAR(100)
AS
BEGIN
   UPDATE Materiales
   set material = @material, descripcion = @descripcion
   where id = @id
END

CREATE PROCEDURE procedure_newCategoria
   @categoria VARCHAR(30),
   @descripcion VARCHAR(100)
AS
BEGIN
  INSERT INTO Categorias_Productos(nombre, descripcion) VALUES
  (@categoria, @descripcion)
END

CREATE PROCEDURE procedure_DeleteCategoriaById
   @id int
AS
BEGIN
   DELETE FROM Categorias_Productos WHERE id = @id
END

CREATE PROCEDURE procedure_UpdateCategoria
   @id int,
   @categoria VARCHAR(50),
   @descripcion VARCHAR(100)
AS
BEGIN
   UPDATE Categorias_Productos
   set nombre = @categoria, descripcion = @descripcion
   where id = @id
END