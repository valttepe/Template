'use strict';

const createError = require('http-errors');
const express = require('express');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sockets = require('./own_modules/socket.js');
const DB = require('./own_modules/database');
const helmet = require('helmet');
const cors = require('cors');
const dot = require('dotenv').config();


// Take routes from route directory
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const chatRouter = require('./routes/chat');

const app = express();

const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem')

const options = {
    key: sslkey,
    cert: sslcert,
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(helmet({
  ieNoOpen: false,
}));

// 'mongodb://catAdmin:Adminpass@localhost:27017/data'
const url = 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/data';
// Connecting to db
DB.connect(url, app, options);

// Somehow useful
app.use('/modules', express.static('node_modules'));

// Add routes to express
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/chat', chatRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
