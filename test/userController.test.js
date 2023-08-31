// eslint-disable-next-line jest/no-standalone-expect
// external
const jwt = require('jsonwebtoken'); 

// internal
const User = require('../models/users');
const userController = require('../controllers/users/users');

jest.mock('jsonwebtoken')

