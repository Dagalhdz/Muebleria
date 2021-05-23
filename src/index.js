const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const passport = require('passport');
const { isLoggedIn, isAdmin } = require('./libs/auth');

//Inicializacion
const app = express();
const sessionStore = new session.MemoryStore;
require('./libs/passport')

// settings
app.set('port', process.env.Port || 3000);

// handlebars settings
app.set('views', path.join(__dirname, 'views'))
app.engine('hbs', exphbs({
   defaultLayout: 'main',
   layoutsDir: path.join(app.get('views'), 'layouts'),
   partialsDir: path.join(app.get('views'), 'partials'),
   extname: '.hbs',
   helpers: require('./libs/handlebars')
}));

app.set('view engine', '.hbs');

// Middlewares
app.use(cookieParser('secretMuebleria'));
app.use(session({
   store: sessionStore,
   saveUninitialized: false,
   resave: false,
   secret: 'secretMuebleria'
}))
app.use(flash());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
   extended: false
}))
app.use(express.urlencoded({extended: false}));
app.use(passport.initialize());
app.use(passport.session());

// Variables Globales
app.use((req, res, next) => {
   app.locals.sessionFlash = req.session.sessionFlash;
   delete req.session.sessionFlash;
   // datos del usurario logueado
   app.locals.user = req.user;
   next()
})

// Routes
app.use(require('./routes'));
app.use(require('./routes/login/auth'));
app.use('/proveedores', isLoggedIn, isAdmin,require('./routes/admin/Proveedores'));
app.use('/productos', isLoggedIn, isAdmin, require('./routes/admin/Productos'));
app.use('/empleados', isLoggedIn, isAdmin, require('./routes/admin/Empleados'));
app.use('/ventas', isLoggedIn,require('./routes/user/Ventas'));

// public
app.use(express.static(path.join(__dirname, 'public')));

// inicar servidor
app.listen(app.get('port'), () => {
   console.log('Servidor en el puerto', app.get('port'));
});
