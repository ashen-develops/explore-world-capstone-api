require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const {
  NODE_ENV
} = require('./config');

const errorHandler = require('./middleware/error-handler');
const authRouter = require('./auth/auth-router'); 
const usersRouter = require('./users/users-router');
const statesRouter = require('./states/states-router');
const suggestionsRouter = require('./suggestions/suggestions-router');

const app = express();


const morganOption = (NODE_ENV === 'production') ?
  'tiny' :
  'common';


app.use(morgan(morganOption, {
  skip: () => NODE_ENV === 'test',
}));

app.use(cors());

app.use(helmet());

app.use('/api/auth', authRouter); 

app.use('/api/users', usersRouter); 

app.use('/api/states', statesRouter);

app.use('/api/suggestions', suggestionsRouter);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use(errorHandler);

module.exports = app;
