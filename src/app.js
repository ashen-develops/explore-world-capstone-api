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
const musicRouter = require('./music/music-router');

const app = express();

const corsOptions = {
  origin: 'https://wonderful-music-contraption.vercel.app'
};

const morganOption = (NODE_ENV === 'production') ?
  'tiny' :
  'common';


app.use(morgan(morganOption, {
  skip: () => NODE_ENV === 'test',
}));
// app.use(cors(corsOptions));
app.use(cors());

app.use(helmet());

app.use(express.static('public'));

//Load user login router
app.use('/api/auth', authRouter); 

//Load user registration router
app.use('/api/users', usersRouter); 

app.use('/api/music', musicRouter);

// basic api endpoint
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use(errorHandler);

module.exports = app;
