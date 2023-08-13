const User = require('../../models/users');
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

const usersControllers = {
    async signup(req, res) {
        try {
            const { email, password } = req.body;
            const hashedPW = await bcrypt.hash(password, 11)
            const newUser = await User.create({
                email: email,
                password: hashedPW
            })
            res.json(newUser);
        } catch (err) {
      console.log(err);
      res.json(err);
    }
    },
};
module.exports = usersControllers;