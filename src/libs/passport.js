const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const { sql, poolPromise} = require('../config/database');
const helpers = require('../libs/helpers');

passport.use('local.signin' , new localStrategy({
   usernameField: 'username',
   passwordField: 'password',
   passReqToCallback: true
}, async (req, username, password, done) =>{
   const pool = await poolPromise;
   const result = await pool.request()
      .input('username', sql.VarChar, username)
      .query('SELECT * FROM Inicio_Sesion WHERE usuario = @username')
   if(Object.keys(result.recordset).length > 0){
      const user = result.recordset[0];
      const validPassword = await helpers.matchPassword(password, user.contraseña);
      const newUser = {
         cajero: user.id,
         usuario: user.usuario,
         password: user.contraseña,
         id_rol: user.id_rol
      }
      // console.log(newUser)
      if(validPassword){
         done(null, newUser, req.flash('success', 'Bienvenido ' + newUser.user));
      }
      else{
         done(null, false, req.flash('msg', 'Incorrect Password'));
      }
   }
   else{
      return done(null, false, req.flash('msg', 'Username no existe'))
   }
}))

passport.use('local.signup', new localStrategy({
   usernameField: 'username',
   passwordField: 'password',
   passReqToCallback: true
}, async (req, username, password, done) => {
   const { cajero, rol } = req.body;
   const user = {
      cajero,
      username,
      password,
      rol
   }
   console.log(user)
   password = await helpers.encryptPassword(password);
   const pool = await poolPromise;
   const result = await pool.request()
      .input('cajero', cajero)
      .input('user', username)
      .input('pass', password)
      .input('rol', rol)
      .execute('procedure_newSesion')
   done(null, null)
}));

passport.serializeUser((user, done) => {
   done(null, user.cajero);
})

passport.deserializeUser(async (id, done) => {
   const pool = await poolPromise;
   const result = await pool.request()
      .query(`SELECT * FROM Inicio_Sesion WHERE id = ${id}`)
   // console.log(result.recordset[0])
   done(null, result.recordset[0]);
})