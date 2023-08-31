
// external
const jwt = require('jsonwebtoken'); 

// internal
const User = require('../models/users');
const userController = require('../controllers/users/users');

// eslint-disable-next-line no-undef
jest.mock('jsonwebtoken');
// eslint-disable-next-line no-undef
jest.mock('../models/users');

describe('loginController', () => {
    
const req = {
            body: {
                email: 'test@example.com',
                password: 'testpassword',
            },
    session: {},
};
const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
};

})


