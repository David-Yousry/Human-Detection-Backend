const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');


const usersRouter = require('./routes/userRoutes');
const catchAsync = require('./utils/catchAsync');
const robotsRouter = require('./routes/robotRoutes');
const generalRouter = require('./routes/generalRoutes');
app.use(express.json());

// Enable CORS


app.use(
  cors({
    origin: "http://localhost:4200",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
  })
);

const mqtt = require('./utils/mqttHelper');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1', generalRouter)
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/robots', robotsRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;



