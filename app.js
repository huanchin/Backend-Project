const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globelErrorHandler = require('./controllers/errorControllers');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const app = express();

/********** Application-level Middleware **************/
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// express.json() is a built in middleware function in Express starting from v4.16.0. It parses incoming JSON requests and puts the parsed data in req.body.
app.use(express.json());

// create our own middleware
// app.use((req, res, next) => {
//   console.log('Hello from the middleware...');
//   next();
// });

app.use((req, res, next) => {
  req.reqestTime = new Date().toISOString();
  next();
});

// mount the router(tourRouter/ userRouter) on the app
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// handling unhandle routes
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });

  // create an error
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // next(err);

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Globel error handling middleware
app.use(globelErrorHandler);

module.exports = app;
