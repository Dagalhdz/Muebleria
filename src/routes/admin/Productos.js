const {request, Router} =require('express')
const router = require('express').Router();

const { route } = require('..');
const { sql, poolPromise} = require('../../config/database');

router.get('/', async (req, res) => {
   const pool = await poolPromise;
   const result = await pool.request()
      .execute('procedure_getAllProducts');
   res.render('body/productos/list', {productos: result.recordset, success: req.flash('success')});
})

router.get('/add', async(req, res) => {
   const pool = await poolPromise;
   const resultColor = await pool.request()
      .query('SELECT * FROM colores');
   const resultMaterial = await pool.request()
      .query('SELECT * FROM Materiales');
   const resultCategoria = await pool.request()
      .query('SELECT * FROM Categorias_Productos');
   res.render('body/productos/add', {color: resultColor.recordset, material: resultMaterial.recordset, categoria: resultCategoria.recordset});
})

router.post('/add', async (req, res) => {
   try{
      const { id, nombre, precio, categoria, material, color, existencia,  description} = req.body
      const pool = await poolPromise;
      const result = await pool.request()
         .input('id', id)
         .input('nombre', nombre)
         .input('precio', precio)
         .input('id_categoria', categoria)
         .input('id_material', material)
         .input('id_color', color)
         .input('existencia', existencia)
         .input('descripcion', description)
         .execute('procedure_newProducto');
      req.flash('success', 'Se ha agregado el producto Correctamente')
      res.redirect('/productos', )
   }
   catch (error){
      console.log(error)
   }
})

router.get('/delete/:id', async (req, res) => {
   const {id} = req.params;
   const pool = await poolPromise;
   const result = await pool.request()
      .input('id', id)
      .execute('procedure_DeleteProductById');
   req.flash('success', 'Se ha eliminado el producto Correctamente');
   res.redirect('/productos');
})

router.get('/edit/:id', async (req, res) => {
   const { id } = req.params;
   const pool = await poolPromise;

   const resultId = await pool.request()
      .input('id', id)
      .execute('procedure_GetProductById');

   const resultColor = await pool.request()
      .query(`SELECT * FROM colores WHERE id != ${resultId.recordset[0].id_color}`);
   
   const resultMaterial = await pool.request()
      .query(`SELECT * FROM Materiales WHERE id != ${resultId.recordset[0].id_material}`);
   
   const resultCategoria = await pool.request()
      .query(`SELECT * FROM Categorias_Productos WHERE id != ${resultId.recordset[0].id_categoria}`);
   
   const resultColorId = await pool.request()
      .query(`SELECT * FROM colores WHERE id = ${resultId.recordset[0].id_color}`);
   const resultMaterialId = await pool.request()
      .query(`SELECT * FROM Materiales WHERE id = ${resultId.recordset[0].id_material}`);
   const resultCategoriaId = await pool.request()
      .query(`SELECT * FROM Categorias_Productos WHERE id = ${resultId.recordset[0].id_categoria}`);
   
   console.log(resultCategoriaId.recordset)
   res.render('body/productos/edit', {producto: resultId.recordset[0], colores: resultColor.recordset, material: resultMaterial.recordset, categoria: resultCategoria.recordset, colorId: resultColorId.recordset[0], materialId: resultMaterialId.recordset[0], categoriaId: resultCategoriaId.recordset[0]})
})

router.post('/edit/:id', async (req, res) => {
   try{
      const { id } = req.params;
      const { nombre, precio, categoria, material, color, existencia,  description} = req.body
      const pool = await poolPromise;
      const result = await pool.request()
         .input('id', id)
         .input('nombre', nombre)
         .input('precio', precio)
         .input('id_categoria', categoria)
         .input('id_material', material)
         .input('id_color', color)
         .input('existencia', existencia)
         .input('descripcion', description)
         .execute('procedure_UpdateProduct');
      req.flash('success', 'Se ha Editado el producto Correctamente');
      res.redirect('/productos', )
   }
    catch (error){
       console.log(error);
   }
})

router.get('/color', async(req, res) => {
   const pool = await poolPromise;
   const result = await pool.request()
      .query('SELECT * FROM Colores');
   res.render('body/productos/color/list', {colores: result.recordset, success: req.flash('success')})
})

router.get('/color/add', (req, res) => {
   res.render('body/productos/color/add')
});

router.post('/color/add', async (req, res) => {
   const { color } = req.body;
   const pool = await poolPromise;
   const result = await pool.request()
      .input('color', sql.VarChar, color)
      .query(`INSERT INTO Colores (color) VALUES (@color)`)
      req.flash('success', 'Se ha Agregado el color Correctamente');
   res.redirect('/productos/color')
})

router.get('/color/delete/:id', async(req, res) =>{
   const { id } = req.params
   const pool = await poolPromise;
   const result = await pool.request()
      .input('id', id)
      .execute('procedure_DeleteColorById');
      req.flash('success', 'Se ha Eliminado el color Correctamente');
   res.redirect('/productos/color');
})

router.get('/color/edit/:id', async(req, res) =>{
   const { id } = req.params;
   const pool = await poolPromise;
   const result = await pool.request()
      .input('id', id)
      .execute('procedure_GetColorById');
   res.render('body/productos/color/edit', {color: result.recordset[0]})
})

router.post('/color/edit/:id', async(req,res) => {
   const { id } = req.params;
   const { color } =req.body;
   const pool = await poolPromise;
   const result = await pool.request()
      .input('id', id)
      .input('color', color)
      .execute('procedure_UpdateColor');
      req.flash('success', 'Se ha Editado el color Correctamente');
   res.redirect('/productos/color')
})

router.get('/material', async(req, res) => {
   const pool = await poolPromise;
   const result = await pool.request()
      .query('SELECT * FROM Materiales');
   res.render('body/productos/material/list', {material: result.recordset, success: req.flash('success')})
})

router.get('/material/add', (req, res) => {
   res.render('body/productos/material/add');
});

router.post('/material/add', async(req, res) => {
   const { material, description } = req.body;
   const pool = await poolPromise;
   const result = await pool.request()
      .input('material', material)
      .input('descripcion', description)
      .execute('procedure_newMaterial');
      req.flash('success', 'Se ha Agregado el material Correctamente');
   res.redirect('/productos/material');
})

router.get('/material/delete/:id', async(req, res) => {
   const { id } = req.params;
   const pool = await poolPromise;
   const result = await pool.request()
      .input('id', id)
      .execute('procedure_DeleteMaterialtById')
      req.flash('success', 'Se ha Eliminado el Material Correctamente');
   res.redirect('/productos/material');
})

router.get('/material/edit/:id', async(req, res) => {
   const { id } = req.params;
   const pool = await poolPromise;
   const result = await pool.request()
      .query(`SELECT * FROM Materiales WHERE id = ${id}`);
   res.render('body/productos/material/edit', {material: result.recordset[0]})
})

router.post('/material/edit/:id', async(req, res) => {
   const { id } = req.params;
   const { material, description } = req.body;
   const pool = await poolPromise;
   const result = await pool.request()
      .input('id', id)
      .input('material', material)
      .input('descripcion', description)
      .execute('procedure_UpdateMaterial');
   res.redirect('/productos/material');
})

router.get('/categoria', async(req, res) => {
   const pool = await poolPromise;
   const result = await pool.request()
      .query('SELECT * FROM Categorias_Productos');
   res.render('body/productos/categoria/list', {categoria: result.recordset, success: req.flash('success')})
})

router.get('/categoria/add', (req, res) => {
   res.render('body/productos/categoria/add');
});

router.post('/categoria/add', async(req, res) => {
   const { categoria, description } = req.body;
   const pool = await poolPromise;
   const result = await pool.request()
      .input('categoria', categoria)
      .input('descripcion', description)
      .execute('procedure_newCategoria');
      req.flash('success', 'Se ha Agregado la categoria Correctamente');
   res.redirect('/productos/categoria');
})

router.get('/categoria/delete/:id', async(req, res) => {
   const { id } = req.params;
   const pool = await poolPromise;
   const result = await pool.request()
      .input('id', id)
      .execute('procedure_DeleteCategoriaById')
      req.flash('success', 'Se ha Eliminado la Categoria Correctamente');
   res.redirect('/productos/categoria');
})

router.get('/categoria/edit/:id', async(req, res) => {
   const { id } = req.params;
   const pool = await poolPromise;
   const result = await pool.request()
      .query(`SELECT * FROM Categorias_Productos WHERE id = ${id}`);
   res.render('body/productos/categoria/edit', {categoria: result.recordset[0]})
})

router.post('/categoria/edit/:id', async(req, res) => {
   const { id } = req.params;
   const { categoria, description } = req.body;
   const pool = await poolPromise;
   const result = await pool.request()
      .input('id', id)
      .input('categoria', categoria)
      .input('descripcion', description)
      .execute('procedure_UpdateCategoria');
      req.flash('success', 'Se ha Editado correctamente Correctamente');
   res.redirect('/productos/categoria');
})

module.exports = router;