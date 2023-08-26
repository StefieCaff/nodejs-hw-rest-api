const User = require('../../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path');
const Jimp = require('jimp');
const fs = require('fs');

const avatarPath = path.join(__dirname, "../../", 'public/avatars'); //* storage folder for files
console.log(avatarPath)

const usersControllers = {
    async signup(req, res) {
        try {
            const { email, password, subscription} = req.body;
            const user = await User.findOne({ email });
            if (user) {
              res.status(409).json({message: "Email in use"});
            };
            const hashedPW = await bcrypt.hash(password, 11);
            const token = jwt.sign({ email }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });
            
            const urlAvatar = gravatar.url(email);
            const newUser = await User.create({
                email: email,
                password: hashedPW,
                subscription,
                avatarURL: urlAvatar + '?d=monsterid'
            });
            console.log(newUser._id);
            req.session.userToken = token
            req.session.userId = newUser._id
            res.json({token});
        } catch (err) {
            console.log(err);
            res.json(err);
        }
    },
    
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const validUser = await User.findOne({ email: email });
            if (!validUser) {
                res.status(401).json({message: 'Unauthorized. Please try again.'})
                return;
            };
            const validatePW = await validUser.comparePassword( password );
            if (!validatePW) {
                res.status(400).json({ message: 'Invalid password. Please check your password and try again.' });
                return;
            };
            const token = jwt.sign({ email }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });
            req.session.userToken = token;
            req.session.userId = validUser._id;
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

    async getCurrentUser(req, res) {
        const { currentUserToken } = req.session.userToken;
        try {
            const currentUser = await User.findOne({ currentUserToken }).select('-__v -admin -password');
            if (!currentUser) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            } else {
                res.status(200).json(currentUser);
                console.log("body", currentUser);
            };
        } catch (error) {
            
        }
    },
    async updateSubscription(req, res) {
        try {
            const { subscription } = req.body;
            const _id = req.user;
            const user = await User.findOneAndUpdate(
                _id,
                { subscription },
                { new: true, },
            );
            if (!user) {
                res.status(404).json({message: "Not authorized"})
            }
            res.status(200).json({ subscription: user.subscription }) ;
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    async updateAvatar(req, res) {
        try {
            const _id = req.user;
            const { path: dbPath } = req.file;
            const fileType = dbPath.split('.')[1];
            const filename = path.join(avatarPath, _id, + '.' + fileType)
            const uploadDir = avatarPath;
            const uploadPath = path.join(uploadDir, filename)
            
            const avatar = await Jimp.read(dbPath);
            await avatar.resize(250, 250)
                .writeAsync(dbPath);
            
            await fs.rename(dbPath, uploadPath);
            
            const avatarURL = path.join('avatar', filename);

            const user = await User.findByIdAndUpdate(_id, { avatarURL });
            if (!user) {
                res.status(401).json({ message: "Not Authorized" });
            };
            res.json({
                avatarURL: user.avatarURL,
            })
            res.json(req.body)
        } catch (err) {
            console.log(err);
            await fs.unlink(req.file.path);
            res.status(401).json({ message: "Not authorized"})
        };
    },
};
module.exports = usersControllers;