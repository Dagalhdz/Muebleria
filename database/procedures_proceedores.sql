use Muebleria

INSERT INTO Proveedores VALUES
(1, 'Daniel Hipolito', 'Galindo Hernandez', 'Muebles del norte', 19, 997, 'Terranova Elite', 'Ottawa', 66646, 117, '81-24-46-13-13'),
(2, 'Javier', 'Vazques', 'Muebles para su Hogar', 9, 286, 'Coyoacan', 'Venustiano Carranza', 67110, 2254, '81-98-65-88-25')

CREATE PROCEDURE procedure_GetAllProveedores
AS
BEGIN
   SELECT p.id, p.nombre, p.apellido, p.empresa, e.nombre estado, m.nombre municipio, p.colonia, p.calle, p.codigo_postal, p.num_exterior, p.telefono FROM Proveedores p
   INNER JOIN estados e on e.id = p.id_estado
   INNER JOIN municipios m on m.id = p.id_municipio
END

CREATE PROCEDURE procedure_GetAllEstados
AS
BEGIN
  SELECT id, clave, nombre FROM estados
END

CREATE PROCEDURE procedure_GetEstadosById
   @id int
AS
BEGIN
  SELECT id, clave, nombre FROM estados WHERE id = @id
END

CREATE PROCEDURE procedure_GetMunicipioById
   @id int
AS
BEGIN
  SELECT id, clave, nombre FROM municipios WHERE id = @id
END


CREATE PROCEDURE procedure_newProveedor
   @id int,
   @nombre VARCHAR(80),
   @apellido VARCHAR(80),
   @empresa VARCHAR(80),
   @id_estado int,
   @id_municipio INT,
   @colonia VARCHAR(40),
   @calle VARCHAR(40),
   @codigo_postal int,
   @num_exterior int,
   @telefono VARCHAR(20)
AS
BEGIN
  INSERT INTO Proveedores VALUES
  (@id, @nombre, @apellido, @empresa, @id_estado, @id_municipio, @colonia, @calle, @codigo_postal, @num_exterior, @telefono)
END

CREATE PROCEDURE procedure_EditProveedor
   @id int,
   @nombre VARCHAR(80),
   @apellido VARCHAR(80),
   @empresa VARCHAR(80),
   @id_estado int,
   @id_municipio INT,
   @colonia VARCHAR(40),
   @calle VARCHAR(40),
   @codigo_postal int,
   @num_exterior int,
   @telefono VARCHAR(20)
AS
BEGIN
  UPDATE Proveedores
  SET nombre = @nombre, apellido = @apellido, empresa = @empresa, id_estado = @id_estado, id_municipio = @id_municipio, colonia = @colonia, calle = @calle, codigo_postal = @codigo_postal, num_exterior = @num_exterior, telefono = @telefono
  WHERE id = @id
END

--exec procedure_EditProveedor 2, 'javer 3', 'Vazques', 'Muebles para su Hogar', 5, 5, 'Benavides', 'independencia', '67110', 610, '54-69-88-51-55'

CREATE PROCEDURE procedure_GetAllProveedor_Producto
AS
BEGIN
   SELECT pp.id, (prov.nombre + ' ' + prov.apellido) nombre_proveedor, prov.empresa empresa, prod.nombre nombre_producto, prod.precio FROM Proveedor_Producto pp
   INNER JOIN Productos prod on prod.id = pp.id_Producto
   INNER JOIN Proveedores prov on prov.id = pp.id_proveedor 
END

CREATE PROCEDURE procedure_GetAllProveedor_ProductoById
   @id int
AS
BEGIN
   SELECT pp.id, (prov.nombre + ' ' + prov.apellido) nombre_proveedor, prov.empresa empresa, prod.nombre nombre_producto, prod.precio FROM Proveedor_Producto pp
   INNER JOIN Productos prod on prod.id = pp.id_Producto
   INNER JOIN Proveedores prov on prov.id = pp.id_proveedor 
   WHERE pp.id = @id
END

CREATE PROCEDURE procedure_NewProveedor_Producto
   @id int,
   @id_producto int,
   @id_proveedor int
AS
BEGIN
   INSERT INTO Proveedor_Producto VALUES
   (@id, @id_producto, @id_proveedor)
END

CREATE PROCEDURE procedure_UpdateProveedor_Producto
   @id int,
   @id_producto int,
   @id_proveedor int
AS
BEGIN
   UPDATE Proveedor_Producto
   SET id_Producto = @id_producto, id_proveedor = @id_proveedor
   WHERE id = @id
END

SELECT * FROM Proveedor_Producto;
SELECT * FROM Orden_Compra;

CREATE PROCEDURE procedure_getAllOrden_Compra
AS
BEGIN
   SELECT c.id, (prov.nombre +' '+prov.apellido) proveedor, prod.nombre producto, c.fecha_compra, c.cantidad, c.sub_total, c.total  FROM Orden_Compra c
   INNER JOIN Proveedor_Producto pp on pp.id = c.id_proveedor_compra
   INNER JOIN Productos prod on prod.id = pp.id_Producto
   INNER JOIN Proveedores prov on prov.id = pp.id_proveedor
END

CREATE PROCEDURE procedure_getExeptOrden_Compra
   @id int
AS
BEGIN
   SELECT c.id, (prov.nombre +' '+prov.apellido) proveedor, prod.nombre producto, c.fecha_compra, c.cantidad, c.sub_total, c.total  FROM Orden_Compra c
   INNER JOIN Proveedor_Producto pp on pp.id = c.id_proveedor_compra
   INNER JOIN Productos prod on prod.id = pp.id_Producto
   INNER JOIN Proveedores prov on prov.id = pp.id_proveedor
   WHERE c.id != @id
END


CREATE PROCEDURE procedure_newOrdenCompra
   @id int,
   @id_proveedor_compra int,
   @cantida int,
   @subtotal money,
   @total money
AS 
BEGIN
   INSERT INTO Orden_Compra(id, id_proveedor_compra, cantidad, sub_total, total) VALUES
      (@id, @id_proveedor_compra, @cantida, @subtotal, @total)
END

CREATE PROCEDURE procedure_UpdateOrdenCompra
   @id int,
   @id_proveedor_compra int,
   @cantida int,
   @subtotal money,
   @total money
AS 
BEGIN
   UPDATE Orden_Compra
   SET id_proveedor_compra = @id_proveedor_compra, cantidad = @cantida, sub_total = @subtotal, total = @total
   WHERE id = @id
END

CREATE PROCEDURE procedure_getOrden_CompraById
   @id int
AS
BEGIN
   SELECT c.id, (prov.nombre +' '+prov.apellido) proveedor, prod.nombre producto FROM Orden_Compra c
   INNER JOIN Proveedor_Producto pp on pp.id = c.id_proveedor_compra
   INNER JOIN Productos prod on prod.id = pp.id_Producto
   INNER JOIN Proveedores prov on prov.id = pp.id_proveedor
   WHERE c.id = @id
END

