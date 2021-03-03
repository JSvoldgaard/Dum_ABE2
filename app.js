require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var db = require('./models/db')
var app = express();

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { type } = require('os');
const jwt = require('express-jwt');
const authorize = require('./helpers/authorize');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API to manage hotelsystem',
    version: '1.0.0',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      }
    }
  },
  security: {
    bearerAuth: []
  },
  servers: [{
    url: 'http://localhost:3000',
    description: 'Development server',
  }, ],
}
const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./controllers/*.js']

}
 
const swaggerSpec = swaggerJSDoc(options);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/users', usersRouter);
app.use('/hotels',require('./controllers/hotel_controller'));
app.use('/rooms',require('./controllers/room_controller'));
// app.use('/rooms',roomsRouter);
app.use('/users',require('./controllers/user_controller'))
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
 

module.exports = app;
