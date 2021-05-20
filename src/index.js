const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');

//Inicializacion
const app = express();

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
app.use(cookieParser('secretmeubleria'));
app.use(session({cookie: { maxAge: 60000 }}));
app.use(flash())
app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}));

// Variables Globales


// Routes
app.use(require('./routes'));
app.use(require('./routes/admin/auth'));
app.use(require('./routes/admin/Proveedores'));
app.use('/productos', require('./routes/admin/Productos'));

// public
app.use(express.static(path.join(__dirname, 'public')));

// inicar servidor
app.listen(app.get('port'), () => {
   console.log('Servidor en el puerto', app.get('port'));
});
