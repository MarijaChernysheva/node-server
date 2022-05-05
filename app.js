const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const usersRouter = require('./routes/usersRoute');
const newsRouter = require('./routes/newsRoute');
const authRouter = require('./routes/authRoute');

const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/news', newsRouter);
app.use('/auth', authRouter);

app.use((req, res, next) => {
  next(createError(NOT_FOUND));
});

app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || INTERNAL_SERVER_ERROR);
  res.render('error');
});

module.exports = app;
