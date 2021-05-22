const router = require('express').Router();
const { sql, poolPromise } = require('../../config/database')

router.get('/', async(req, res) => {
   const pool = await poolPromise;
   const result = await pool.request()
      .execute('procedure_getEmpleados');
   res.render('body/empleados/list', {empleados: result.recordset, success: req.flash('success')})
})

router.get('/add', async (req, res) => {
   const pool = await poolPromise;
   const resultEstados = await pool.request()
      .query('SELECT id, clave, nombre FROM estados');

   const resultPuesto = await pool.request()
      .query('SELECT id, nombre FROM Puesto_Empleado');

   res.render('body/empleados/add', {estados: resultEstados.recordset, puestos: resultPuesto.recordset});
})

router.post('/add', async (req, res) => {
   const { id, nombre, apellido, email, sexo, fecha_nac, puesto, estado, municipios, colonia, calle, codigoPostal, numExterior, telefono } = req.body;
   const pool = await poolPromise;
   const result = await pool.request()
      .input('id', id)
      .input('nombre', nombre)
      .input('apellido', apellido)
      .input('email', email)
      .input('sexo', sexo)
      .input('fecha_nac', fecha_nac)
      .input('id_puesto', puesto)
      .input('id_estado', estado)
      .input('id_municipio', municipios)
      .input('colonia', colonia)
      .input('calle', calle)
      .input('codigo_postal', codigoPostal)
      .input('num_exterior', numExterior)
      .input('telefono', telefono)
      .execute('procedure_newEmpleado');
   req.flash('success', 'Se ha agregado un Empleado Correctamente');
   res.redirect('/empleados');
})

router.get('/edit/:id', async (req, res) => {
   const { id } =  req.params;

   const pool = await poolPromise;

   const resultEmpleados = await pool.request()
   .query(`SELECT * FROM Empleados WHERE id = ${id}`);

   console.log(resultEmpleados.recordset)

   const resultPuestoAll =  await pool.request()
      .query(`SELECT id, nombre FROM Puesto_Empleado WHERE id != ${resultEmpleados.recordset[0].id_puesto}`);
   
   const resultPuestoId =  await pool.request()
      .query(`SELECT id, nombre FROM Puesto_Empleado WHERE id = ${resultEmpleados.recordset[0].id_puesto}`);

   const resultEstadoId = await pool.request()
      .input('id', resultEmpleados.recordset[0].id_estado)
      .execute('procedure_GetEstadosById')

   const resultAllEstado = await pool.request()
      .query(`SELECT id, clave, nombre FROM estados WHERE id != ${resultEmpleados.recordset[0].id_estado}`);

   const resultIdMunicipio = await pool.request()
      .query(`SELECT id, clave, nombre FROM municipios WHERE id = ${resultEmpleados.recordset[0].id_municipio}`);

   res.render('body/empleados/edit', {empleado: resultEmpleados.recordset[0], estadoId: resultEstadoId.recordset[0], estadosAll: resultAllEstado.recordset, municipioId: resultIdMunicipio.recordset[0], puestoId: resultPuestoId.recordset[0], puestoAll: resultPuestoAll.recordset})
})

router.post('/edit/:id', async(req, res) => {
   const { id } = req.params
   const { nombre, apellido, email, sexo, fecha_nac, puesto, estado, municipios, colonia, calle, codigoPostal, numExterior, telefono } = req.body;
   const pool = await poolPromise;
   const result = await pool.request()
      .input('id', id)
      .input('nombre', nombre)
      .input('apellido', apellido)
      .input('email', email)
      .input('sexo', sexo)
      .input('fecha_nac', fecha_nac)
      .input('id_puesto', puesto)
      .input('id_estado', estado)
      .input('id_municipio', municipios)
      .input('colonia', colonia)
      .input('calle', calle)
      .input('codigo_postal', codigoPostal)
      .input('num_exterior', numExterior)
      .input('telefono', telefono)
      .execute('procedure_UpdateEmpleado');
   req.flash('success', 'Se ha Editado un Empleado Correctamente');
   res.redirect('/empleados');
});

router.get('/delete/:id', async(req, res) => {
   const { id } = req.params;
   const pool = await poolPromise;
   const result = await pool.request()
      .query(`DELETE FROM Empleados WHERE id = ${id}`)

   req.flash('success', 'Se ha Eliminado un Empleado Correctamente');
   res.redirect('/empleados');
})

router.get('/puesto', async(req, res) => {
   const pool = await poolPromise;
   const result = await pool.request()
      .query('SELECT * FROM Puesto_Empleado');
   res.render('body/empleados/puesto/list', {puesto: result.recordset, success: req.flash('success')})
})

router.get('/puesto/add', (req, res) => {
   res.render('body/empleados/puesto/add');
})

router.post('/puesto/add', async(req, res) => {
   const { id, nombre, descripcion, salario} = req.body;
   const pool = await poolPromise;
   const result = await pool.request()
      .input('id', id)
      .input('nombre', nombre)
      .input('descripcion', descripcion)
      .input('salario', salario)
      .execute('procedure_newPuesto');
   req.flash('success', 'Se ha agregado un puesto de trabajo Correctamente')
   res.redirect('/empleados/puesto')
});

router.get('/puesto/delete/:id', async(req, res) => {
   const { id }  = req.params;
   const pool = await poolPromise;
   const result = await pool.request()
      .query(`DELETE FROM Puesto_Empleado WHERE id = ${id}`)
   req.flash('success', 'Se ha Eliminado un puesto de trabajo Correctamente')
   res.redirect('/empleados/puesto')
})

router.get('/puesto/edit/:id', async(req, res) => {
   const { id } = req.params;
   const pool = await poolPromise;
   const result = await pool.request()
      .query(`SELECT * FROM Puesto_Empleado WHERE id = ${id}`)
   res.render('body/empleados/puesto/edit', {puesto: result.recordset[0]});
})

router.post('/puesto/edit/:id', async(req, res) => {
   const { id } = req.params;
   const { nombre, descripcion, salario } = req.body;
   const pool = await poolPromise;
   const result = await pool.request()
      .input('id', id)
      .input('nombre', nombre)
      .input('descripcion', descripcion)
      .input('salario', salario)
      .execute('procedure_UpdatePuesto');
   req.flash('success', 'Se ha Editado un puesto de trabajo Correctamente')
   res.redirect('/empleados/puesto')
})


router.get('/cajeros', async(req, res) => {
   const pool = await poolPromise;
   const result = await pool.request()
      .execute('procedure_getCajeros');
   
   res.render('body/empleados/cajeros/list', {cajero: result.recordset, success: req.flash('success')})
})

router.get('/cajeros/add', async (req, res) => {
   const pool = await poolPromise;
   const result = await pool.request()
      .execute('procedure_getNoCajeros');
   res.render('body/empleados/cajeros/add', {cajero: result.recordset});
})

router.post('/cajeros/add', async (req, res) => {
   const { cajero } = req.body
   console.log(cajero)
   const pool = await poolPromise;
   const result = await pool.request()
      .query(`INSERT INTO Cajeros VALUES (${cajero})`);
   req.flash('success', 'Se ha Agregado un cajero correctamente')
   res.redirect('/empleados/cajeros')
})

router.get('/cajeros/delete/:id', async (req, res) => {
   const { id } = req.params;
   const pool = await poolPromise;
   const result = await pool.request()
      .query(`DELETE FROM Cajeros WHERE id = ${id}`)
   req.flash('success', 'Se ha Eliminado un cajero correctamente')
   res.redirect('/empleados/cajeros')
})



module.exports = router;