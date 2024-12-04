const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

// const toursRouter = require('./routes/toursRouters');
const usersRouter = require('./routes/userRoutes');

app.use(express.json());

// Enable CORS

app.use(
  cors({
    origin: "http://localhost:4200/",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}



app.use((req, res, next) => {
  console.log('hello from middleware');
  next();
});


app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); // adding date to request
  next(); // dont forget
});


// app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;



