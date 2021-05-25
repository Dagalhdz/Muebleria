const router = require('express').Router();

const {sql, poolPromise} = require('../../config/database')

router.get('/', async(req, res) => {
   const pool = await poolPromise;
   const result = await pool.request()
      .query('SELECT * FROM Productos')
   res.render('body/ventas/menu', {productos: result.recordset})
})

router.post('/', async(req, res) => {
   const { producto, factura} = req.body
   const pool = await poolPromise;

   // console.log(producto)
   // console.log(factura)

   const result = await pool.request()
      .input('id', factura.id)
      .input('nombre', factura.nombre)
      .input('apellido', factura.apellido)
      .execute('procedure_NewFactura')

   producto.map(async(data) => {
      const result = await pool.request()
         .input('id', data.id)
         .input('inicio_sesion', req.user.id)
         .input('id_producto', data.id_producto)
         .input('cantidad', data.cantidad)
         .input('subtotal', data.subtotal)
         .input('descuento', data.descuento)
         .input('total', data.total)
         .execute('procedure_NewVenta');
      
      const result2 = await pool.request()
         .input('id_venta', data.id)
         .input('id_factura', factura.id)
         .execute('procedure_NewDetalleVenta')
   })
   res.redirect('/ventas')
})

router.get('/lista', async( req, res) => {
   const pool = await poolPromise;
   const result = await pool.request()
      .query(`SELECT id_producto, cantidad, total from ventas where id_inicio_sesion = ${req.user.id}`)
   res.render('body/ventas/list', {result: result.recordset});
})


router.get('/all/:id', async(req, res) => {
   const { id } = req.params;
   const pool = await poolPromise;
   const result = await pool.request()
      .query(`SELECT * FROM Productos WHERE id = ${id}`);
   res.send(result.recordset[0]);
})

module.exports = router;