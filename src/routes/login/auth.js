const router = require('express').Router();

const {sql, poolPromise} = require('../../config/database');
const passport = require('passport');
const { isLoggedIn, isAdmin } = require('../../libs/auth');

router.get('/signup', isLoggedIn, isAdmin, async(req, res) =>{
   const pool = await poolPromise;
   const result = await pool.request()
      .query('procedure_getCajerosInicio');
   res.render('body/auth/signup', {cajero: result.recordset, success: req.flash('success')})
});

router.post('/signup', passport.authenticate('local.signup', {
   successRedirect: '/productos',
   failureRedirect: '/signup',
   failureFlash: true
}));

router.get('/signin', (req, res) => {
   res.render('body/auth/signin', {msg: req.flash('msg')});
});

router.post('/signin', passport.authenticate('local.signin', {
      successRedirect: '/Productos',
      failureRedirect: '/signin',
      failureFlash: true
}));

router.get('/logout', (req, res) => {
   req.logOut();
   res.redirect('/signin')
})

module.exports = router;