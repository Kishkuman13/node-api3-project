const express = require('express');

const userRouter = require('./users/users-router');
const { logger } = require('./middleware/middleware.js');

const helmet = require('helmet');
const morgan = require('morgan');

const server = express();

server.use(express.json());

server.use(helmet());
server.use(morgan('dev'));
server.use(logger);

server.use('/api/users', userRouter);

// remember express by default cannot parse JSON in request bodies

// global middlewares and the user's router need to be connected here

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use((err, req, res, next) => {
  const message = err?.message || 'Something went wrong';
  const statusCode = err?.status || 500;
  res.status(statusCode).json({ message })
})

module.exports = server;
