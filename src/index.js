const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

//Inicializacion
const app = express();
const sessionStore = new session.MemoryStore;

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
   cookie: {maxAge: 60000},
   store: sessionStore,
   saveUninitialized: true,
   resave: 'true',
   secret: 'secretMuebleria'
}))
app.use(flash())

app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}));

// Variables Globales
app.use((req, res, next) => {
   app.locals.sessionFlash = req.session.sessionFlash;
   delete req.session.sessionFlash;
   next()
})

// Routes
app.use(require('./routes'));
app.use(require('./routes/admin/auth'));
app.use('/proveedores' ,require('./routes/admin/Proveedores'));
app.use('/productos', require('./routes/admin/Productos'));

// public
app.use(express.static(path.join(__dirname, 'public')));

// inicar servidor
app.listen(app.get('port'), () => {
   console.log('Servidor en el puerto', app.get('port'));
});
