const User = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const usersControllers = {
    async signup(req, res) {
        try {
            const { email, password } = req.body;
        } catch (err) {
      console.log(err);
      res.json(err);
    }
    }

};

module.exports = usersControllers;