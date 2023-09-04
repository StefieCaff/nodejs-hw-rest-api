require('jsonwebtoken');
const usersControllers = require('../controllers/users/users'); // Replace with the actual path to your controller
const User = require('../models/users'); // Replace with the actual path to your User model

// Mock the dependencies
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mockedToken'), // Mock the token creation
}));
jest.mock('../models/users'); // Mock the User model methods

describe('login controller', () => {
    // Test for status code
    test('should return status code 200', async () => {
        // Mock request and response objects
        const req = {
            body: {
                email: 'test@example.com',
                password: 'validPassword',
                subscription: 'premium',
            },
            session: {},
        };
        const res = {
            status: jest.fn().mockReturnThis(), // Mock status() method
            json: jest.fn(), // Mock json() method
        };

        // Mock User.findOne() to simulate a valid user
        User.findOne.mockResolvedValueOnce({
            email: req.body.email,
            verify: true,
            comparePassword: jest.fn().mockResolvedValue(true), // Mock password comparison
        });

        // Call the login controller
        await usersControllers.login(req, res);

        // Verify the response for status code
        expect(res.status).toHaveBeenCalledWith(200); // Check if status code is 200
    });

    // Test for token
    test('should return a token', async () => {
        // Mock request and response objects
        const req = {
            body: {
                email: 'test@example.com',
                password: 'validPassword',
                subscription: 'premium',
            },
            session: {},
        };
        const res = {
            status: jest.fn().mockReturnThis(), // Mock status() method
            json: jest.fn(), // Mock json() method
        };

        // Mock User.findOne() to simulate a valid user
        User.findOne.mockResolvedValueOnce({
            email: req.body.email,
            verify: true,
            comparePassword: jest.fn().mockResolvedValue(true), // Mock password comparison
        });

        // Call the login controller
        await usersControllers.login(req, res);

        // Verify the response for the token
        expect(res.json).toHaveBeenCalledWith({ token: 'mockedToken' }); // Ensure the token is returned
    });

    // Test for email and subscription
    test('should return email and subscription', async () => {
        // Mock request and response objects
        const req = {
            body: {
                email: 'test@example.com',
                password: 'validPassword',
                subscription: 'premium',
            },
            session: {},
        };
        const res = {
            status: jest.fn().mockReturnThis(), // Mock status() method
            json: jest.fn(), // Mock json() method
        };

        // Mock User.findOne() to simulate a valid user
        User.findOne.mockResolvedValueOnce({
            email: req.body.email,
            verify: true,
            comparePassword: jest.fn().mockResolvedValue(true), // Mock password comparison
        });

        // Call the login controller
        await usersControllers.login(req, res);

        // Verify the response for email and subscription
        expect(res.json).toHaveBeenCalledWith({
            email: req.body.email, // Check if email is returned
            subscription: req.body.subscription, // Check if subscription is returned
        });
    });

});