const router = require('express').Router();

const { poolPromise, sql } = require('../../config/database');

router.get('/', async(req, res) => {
   const pool = await poolPromise;
   const result = await pool.request()
      .execute('procedure_GetAllProveedores');
   // res.send(result.recordset)
   res.render('body/proveedores/list', {proveedores: result.recordset, success: req.flash('success')});
})

router.get('/add', async(req, res) => {
   const pool = await poolPromise;
   const result = await pool.request()
      .query('SELECT id, clave, nombre FROM estados');
   res.render('body/proveedores/add', {estados: result.recordset});
})

router.post('/add', async(req, res) => {
   const { id, nombre, apellido, empresa, estado, municipios, colonia, calle, codigoPostal, numExterior, telefono } = req.body;
   const pool = await poolPromise;
   const result = await pool.request()
      .input('id', id)
      .input('nombre', nombre)
      .input('apellido', apellido)
      .input('empresa', empresa)
      .input('id_estado', estado)
      .input('id_municipio', municipios)
      .input('colonia', colonia)
      .input('calle', calle)
      .input('codigo_postal', codigoPostal)
      .input('num_exterior', numExterior)
      .input('telefono', telefono)
      .execute('procedure_newProveedor');
   req.flash('success', 'Se ha agregado un proveedor Correctamente');
   res.redirect('/proveedores');
})

router.get('/delete/:id', async(req, res) => {
   const { id } = req.params;
   const pool = await poolPromise;
   const result = await pool.request()
      .query(`DELETE FROM Proveedores WHERE id = ${id}`);
   req.flash('success', 'Se ha Eliminado un proveedor Correctamente');
   res.redirect('/proveedores');
})

router.get('/edit/:id', async(req, res) => {
   const { id } = req.params;
   const pool = await poolPromise;
   const resultProveedor = await pool.request()
      .query(`SELECT * FROM Proveedores WHERE id = ${id}`);

   const resultEstadoId = await pool.request()
      .input('id', resultProveedor.recordset[0].id_estado)
      .execute('procedure_GetEstadosById')

   const resultAllEstado = await pool.request()
      .query(`SELECT id, clave, nombre FROM estados WHERE id != ${resultProveedor.recordset[0].id_estado}`);

   const resultIdMunicipio = await pool.request()
      .query(`SELECT id, clave, nombre FROM municipios WHERE id = ${resultProveedor.recordset[0].id_municipio}`);
   
   console.log(resultAllEstado.recordset);
   
   res.render('body/proveedores/edit', {proveedor: resultProveedor.recordset[0], estadoId: resultEstadoId.recordset[0], estadoAll: resultAllEstado.recordset, municipioId: resultIdMunicipio.recordset[0] })
});

router.post('/edit/:id', async (req, res) => {
   const { id } = req.params;
   const { nombre, apellido, empresa, estado, municipios, colonia, calle, codigoPostal, numExterior, telefono } = req.body;
   const pool = await poolPromise;
   const result = await pool.request()
      .input('id', id)
      .input('nombre', nombre)
      .input('apellido', apellido)
      .input('empresa', empresa)
      .input('id_estado', estado)
      .input('id_municipio', municipios)
      .input('colonia', colonia)
      .input('calle', calle)
      .input('codigo_postal', codigoPostal)
      .input('num_exterior', numExterior)
      .input('telefono', telefono)
      .execute('procedure_EditProveedor');
   req.flash('success', 'Se ha Editado un proveedor Correctamente');
   res.redirect('/proveedores');
});

router.get('/producto', async(req, res) => {
   const pool = await poolPromise;
   const result = await pool.request()
      .execute('procedure_GetAllProveedor_Producto');
   res.render('body/proveedores/producto/list', {result: result.recordset, success: req.flash('success')});
});

router.get('/producto/add', async(req, res) => {
   const pool = await poolPromise;
   const resultProducto = await pool.request()
      .query('SELECT id, nombre FROM Productos')
   const resultProveedores = await pool.request()
      .query('SELECT id, nombre, apellido FROM Proveedores');
   res.render('body/proveedores/producto/add', {producto: resultProducto.recordset, proveedor: resultProveedores.recordset});
});

router.post('/producto/add', async(req, res) => {
   const {id, proveedor, producto} = req.body;
   const pool = await poolPromise;
   const resultProducto = await pool.request()
      .input('id', id)
      .input('id_proveedor', proveedor)
      .input('id_producto', producto)
      .execute('procedure_NewProveedor_Producto');
   req.flash('success', 'Se ha Agregado un proveedor-producto correctamente');
   res.redirect('/proveedores/producto');
})

router.get('/producto/delete/:id', async(req, res) => {
   const { id } = req.params;
   const pool = await poolPromise;
   const result = await pool.request()
      .query(`DELETE FROM Proveedor_Producto WHERE id = ${id}`);
   req.flash('success', 'Se ha Eliminado un proveedor-producto correctamente');
   res.redirect('/proveedores/producto');
})

router.get('/producto/edit/:id', async(req, res) => {
   const { id } = req.params;
   const pool = await poolPromise;

   const result = await pool.request()
      .query(`SELECT * FROM Proveedor_Producto WHERE id = ${id}`);

   const resultProvId = await pool.request()
      .query(`SELECT id, nombre, apellido FROM Proveedores WHERE id = ${result.recordset[0].id_proveedor}`)

   const resultProvAll = await pool.request()
      .query(`SELECT id, nombre, apellido FROM Proveedores WHERE id != ${result.recordset[0].id_proveedor}`)

   const resultProdId = await pool.request()
      .query(`SELECT id, nombre FROM Productos WHERE id = ${result.recordset[0].id_Producto}`)

   const resultProdAll = await pool.request()
      .query(`SELECT id, nombre FROM Productos WHERE id != ${result.recordset[0].id_Producto}`)

   res.render('body/proveedores/producto/edit', {result: result.recordset[0], provId: resultProvId.recordset[0], provAll: resultProvAll.recordset, prodId: resultProdId.recordset[0], prodAll: resultProdAll.recordset})
})

router.post('/producto/edit/:id', async(req, res) => {
   const { id } = req.params;
   const { producto, proveedor} = req.body;
   const pool = await poolPromise;
   const result = await pool.request()
      .input('id', id)
      .input('id_Producto', producto)
      .input('id_proveedor', proveedor)
      .execute('procedure_UpdateProveedor_Producto')
   req.flash('success', 'Se ha Modificado un proveedor-producto correctamente');
   res.redirect('/proveedores/producto');
});

router.get('/compra', async(req, res) => {
   const pool = await poolPromise;
   const result = await pool.request()
      .execute('procedure_getAllOrden_Compra');
   res.render('body/proveedores/compra/list', {compra: result.recordset, success: req.flash('success')})
})

router.get('/compra/delete/:id', async(req, res) => {
   const { id } = req.params;
   const pool = await poolPromise;
   const result = await pool.request()
      .query(`DELETE FROM  Orden_Compra WHERE id = ${id}`);
   req.flash('success', 'Se ha Eliminado una orden de compra correctamente');
   res.redirect('/proveedores/compra');
})

router.get('/compra/add', async(req, res) => {
   const pool = await poolPromise;
   const result = await pool.request()
      .execute('procedure_GetAllProveedor_Producto');
   console.log(result.recordset);
   res.render('body/proveedores/compra/add', {result: result.recordset});
})

router.post('/compra/add', async(req, res) => {
   const { id, prod_prov, cantidad, subtotal, total} = req.body;
   const pool = await poolPromise;
   const result = await pool.request()
      .input('id', id)
      .input('id_proveedor_compra', prod_prov)
      .input('cantida', cantidad)
      .input('subtotal', subtotal)
      .input('total', total)
      .execute('procedure_newOrdenCompra');
   req.flash('success', 'Se ha Agregado una orden de compra correctamente');
   res.redirect('/proveedores/compra');
})

router.get('/compra/edit/:id', async(req, res) => {
   const { id } = req.params;
   const pool = await poolPromise;

   const resultOrdenId = await pool.request()
      .query(`SELECT id, id_proveedor_compra, cantidad, sub_total, total FROM Orden_Compra WHERE id = ${id}`)
   
   const provCompraAll = await pool.request()
      .input('id', resultOrdenId.recordset[0].id_proveedor_compra)
      .execute('procedure_getExeptOrden_Compra');

   const provCompraId = await pool.request()
      .input('id', resultOrdenId.recordset[0].id_proveedor_compra)
      .execute('procedure_getOrden_CompraById')

   res.render('body/proveedores/compra/edit', {ordenId: resultOrdenId.recordset[0], provCompraId: provCompraId.recordset[0], provCompraAll: provCompraAll.recordset})
})

router.post('/compra/edit/:id', async(req, res) => {
   const { id } = req.params;
   const { prod_prov, cantidad, subtotal, total } = req.body;
   const pool = await poolPromise;
   const result = await pool.request()
      .input('id', id)
      .input('id_proveedor_compra', prod_prov)
      .input('cantida', cantidad)
      .input('subtotal', subtotal)
      .input('total', total)
      .execute('procedure_UpdateOrdenCompra')
   req.flash('success', 'Se ha Editado una orden de compra correctamente');
   res.redirect('/proveedores/compra');
})


/* Rutas que solo envuan datos */
router.get('/municipios/:id', async (req, res) => {
   const { id } = req.params;
   const pool = await poolPromise;
   const result = await pool.request()
      .query(`SELECT id, clave, nombre FROM municipios WHERE estado_id = ${id}`);
   res.send(result.recordset)
});

router.get('/compra/precio/:id', async(req, res) => {
   const { id } = req.params
   const pool = await poolPromise;
   const result = await pool.request()
      .input('id', id)
      .execute('procedure_GetAllProveedor_ProductoById')
   res.send(result.recordset)
})


module.exports = router;