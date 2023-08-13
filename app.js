const express = require('express');
const session = require('express-session');
const logger = require('morgan');
const cors = require('cors');
require(‘dotenv’).config();
const contactsRouter = require('./routes/api/contacts')
const app = express()
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

const sess = {
  secret: process.env.JWT_SECRET,
  cookie: {
    maxAge: 300000,
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  },
  resave: false,
  saveUninitialized: true,
};

app.use(session(sess));
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
});

module.exports = app;
