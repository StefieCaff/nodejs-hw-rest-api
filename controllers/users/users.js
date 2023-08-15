const User = require('../../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const usersControllers = {
    async signup(req, res) {
        try {
            const { email, password } = req.body;
            const hashedPW = await bcrypt.hash(password, 11);
            const token = jwt.sign({ email }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });
            const newUser = await User.create({
                email: email,
                password: hashedPW
            })
            req.session.userToken = token;
            res.json(newUser);
        } catch (err) {
            console.log(err);
            res.json(err);
        }
    },
    
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const validUser = await User.findOne({ email: email })
            if (!validUser) {
                res.status(401).json({message: 'Unauthorized. Please try again.'})
                return;
            }
            const validatePW = await validUser.comparePassword( password );
            if (!validatePW) {
                res.status(400).json({ message: 'Invalid password. Please check your password and try again.' });
                return;
            };
            const token = jwt.sign({ email }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            })
            req.session.userToken = token;
            console.log('session', req.session);
            res.status(200).json({token});

        } catch (err) {
            console.log(err);
            res.json(err);
        }
    },

    async logout(req, res) {
        if (req.session.userToken) {
            req.session.destroy(() => {
            res.json({ message: "You have been logged out" });
            })
        } else {
            res.status(401).json({ message: 'Unauthorized' });
        };
    },
};
module.exports = usersControllers;