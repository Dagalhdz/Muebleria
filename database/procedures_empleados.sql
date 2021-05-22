use Muebleria

INSERT INTO Puesto_Empleado VALUES
(1, 'puesto 1', 'descripcion del puesto 1', 100),
(2, 'puesto 2', 'descripcion del puesto 2', 200),
(3, 'puesto 3', 'descripcion del puesto 3', 300)

CREATE PROCEDURE procedure_newPuesto
   @id int,
   @nombre VARCHAR(50),
   @descripcion VARCHAR(100),
   @salario MONEY
AS
BEGIN
   INSERT INTO Puesto_Empleado VALUES (@id, @nombre, @descripcion, @salario)
END

CREATE PROCEDURE procedure_UpdatePuesto
   @id int,
   @nombre VARCHAR(50),
   @descripcion VARCHAR(100),
   @salario MONEY
AS
BEGIN
   UPDATE Puesto_Empleado
   SET nombre = @nombre, descripcion = @descripcion, salario = @salario
   WHERE id = @id
END

INSERT INTO Empleados VALUES
(1, 'Daniel', 'Galindo', 'daniel_msn2@hotmail.com', 'M', '02/01/1997', '1', '1', '1', 'Zaragosa', 'Ottawa', 67110, 117, 8121461313)

CREATE PROCEDURE procedure_getEmpleados
AS
BEGIN
   SELECT em.id, em.nombre, em.apellido, em.email, em.sexo, em.fecha_nac, p.nombre puesto, es.nombre estado, m.nombre municipio, em.colonia, em.calle, em.codigo_postal, em.num_exterior, em.telefono FROM Empleados em
   INNER JOIN Puesto_Empleado p on p.id = em.id_puesto
   INNER JOIN estados es on es.id = em.id_estado
   INNER JOIN municipios m on m.id = em.id_municipio
END

CREATE PROCEDURE procedure_newEmpleado
   @id int,
   @nombre VARCHAR(80),
   @apellido VARCHAR(80),
   @email VARCHAR(100),
   @sexo char,
   @fecha_nac DATE,
   @id_puesto int,
   @id_estado int,
   @id_municipio INT,
   @colonia VARCHAR(40),
   @calle VARCHAR(40),
   @codigo_postal int,
   @num_exterior int,
   @telefono VARCHAR(20)
AS
BEGIN
  INSERT INTO Empleados VALUES
  (@id, @nombre, @apellido, @email, @sexo, @fecha_nac, @id_puesto, @id_estado, @id_municipio, @colonia, @calle, @codigo_postal, @num_exterior, @telefono)
END

CREATE PROCEDURE procedure_UpdateEmpleado
   @id int,
   @nombre VARCHAR(80),
   @apellido VARCHAR(80),
   @email VARCHAR(100),
   @sexo char,
   @fecha_nac DATE,
   @id_puesto int,
   @id_estado int,
   @id_municipio INT,
   @colonia VARCHAR(40),
   @calle VARCHAR(40),
   @codigo_postal int,
   @num_exterior int,
   @telefono VARCHAR(20)
AS
BEGIN
   UPDATE Empleados
   SET nombre = @nombre, apellido = @apellido, email = @email, sexo = @sexo, fecha_nac = @fecha_nac, id_puesto = @id_puesto, id_estado = @id_estado, id_municipio = @id_municipio, colonia = @colonia, codigo_postal = @codigo_postal, num_exterior = @num_exterior, telefono = @telefono
   WHERE id = @id
END

CREATE PROCEDURE procedure_getCajeros
AS
BEGIN
   SELECT Empleados.id, (nombre + ' ' + apellido)nombre, telefono, email  FROM Cajeros 
   INNER JOIN Empleados on Empleados.id = Cajeros.id
END

CREATE PROCEDURE procedure_getNoCajeros
AS
BEGIN
   SELECT e.id, e.nombre +' '+e.apellido nombre FROM Empleados e
   LEFT JOIN Cajeros c on c.id = e.id
   where C.id is null
END


SELECT e.id, e.nombre +' '+e.apellido nombre FROM Empleados e
LEFT JOIN Cajeros c on c.id = e.id
where C.id is null




