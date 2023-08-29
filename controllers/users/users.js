// external
const User = require('../../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs');
const Jimp = require('jimp');
const nanoid = require('nanoid');
// internal
const resizeImageToMaxSize = require('../../utils/resize-avatar');
const sendVerificationEmail = require('../../utils/nodemailer');

const avatarPath = path.join(__dirname, "../../", 'public/avatars'); //* storage folder for files
console.log(avatarPath)

const usersControllers = {
    async signup(req, res) {
        try {
            const { email, password, subscription} = req.body;
            const user = await User.findOne({ email });
            if (user) {
                res.status(409).json({ message: "Email in use" });
                return;
            };
            const verificationToken = nanoid.nanoid(10);
            const hashedPW = await bcrypt.hash(password, 11);
            const token = jwt.sign({ email }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });
            const urlAvatar = gravatar.url(email);
            const newUser = await new User({
                email: email,
                password: hashedPW,
                subscription,
                avatarURL: urlAvatar + '?d=monsterid',
                verificationToken,
                verify: false, // Initialize verify as false
            });
            await newUser.save();
            req.session.userToken = token;
            req.session.userId = newUser._id;
            req.session.validationToken = verificationToken;
            res.json({ token, verificationToken });
            await sendVerificationEmail(email, verificationToken);
        } catch (err) {
            console.error('Error signing up user:', err);
            res.json(err);
        }
    },
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const validUser = await User.findOne({ email });
            if (!validUser) {
                return res.status(401).json({message: 'User not found.'})
                
            };
            if (!validUser.verify) {
                 return res.status(403).json({ error: 'Email not verified' });
            }
            const validatePW = await validUser.comparePassword( password );
                if (!validatePW) {
                    return res.status(400).json({ message: 'Invalid password. Please check your password and try again.' })
            };
            const token = jwt.sign({ email }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });
            req.session.userToken = token;
            req.session.userId = validUser._id;
            res.status(200).json({token});

        } catch (err) {
            console.error('Error logging in user:', err);
            res.json(err);
        }
    },

    async logout(req, res) {
        if (req.session.userToken) {
            req.session.destroy(() => {
            return res.json({ message: "You have been logged out" });
            })
        } else {
            console.error('Error logging out user');
            return res.status(401).json({ message: 'Unauthorized' });
        };
    },
    async verifyUser(req, res) {
        const { verificationToken } = req.params.verificationToken;
        const verifiedUser = await User.findOneAndUpdate(
            { verificationToken },
            {
                verificationToken: null,
                verify: true,
            },
            {new: true}
        );
        try {
            !verifiedUser
                ? res.status(404).json({ message: "User not found" })
                : res.status(200).json({ message: "Verification successful" });
        } catch (err) {
            console.error('Error verifying user:', err);
            res.status(500).json(err);
        }  
    },
    async getCurrentUser(req, res) {
        const { currentUserToken } = req.session.userToken;
        try {
            const currentUser = await User.findOne({ currentUserToken }).select('-__v -admin -password');
            if (!currentUser) {
                return res.status(401).json({ message: "Unauthorized" });
                
            } else {
                console.log("body", currentUser);
                return res.status(200).json(currentUser);
            };
        } catch (err) {
            console.error('Error finding user:', err);
            res.status(500).json(err);
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
                return res.status(404).json({message: "Not authorized"})
            }
              return res.status(200).json({ subscription: user.subscription }) ;
        } catch (err) {
            console.error('Error updating user:', err);
            res.status(500).json(err);
        }
    },
    async updateAvatar(req, res) {
        try {
            console.log("req.file:", req.file); // Log the uploaded file information
           
            const _id = req.session.userId; // Get the user's ID from the session
            const { path: tempPath, mimetype } = req.file; // Extract the temporary file path and mimetype from the request file
            const fileType = mimetype.split("/")[1]; // Extract the file type (extension) from the mimetype
            const fileName = path.join(avatarPath, `${_id}.${fileType}`); // Create the full path for the new avatar file
            
            console.log("paths", tempPath, fileName)
             
            // await avatar.resize(250, 250).writeAsync(fileName); // Resize the image to 250x250 pixels and save it with the calculated file name

            try {
                const avatar = await Jimp.read(tempPath); // Read the temporary uploaded file using Jimp
                await resizeImageToMaxSize(tempPath, fileName, (1024 * 1024));
                await avatar.resize(250, 250); 
                await avatar.writeAsync(fileName);
            } catch (jimpError) {
                console.error('Jimp Error:', jimpError);
                res.status(500).json({ message: 'Error processing avatar' });
                return;
            }
                await fs.promises.unlink(tempPath); // Delete the temporary uploaded file 
                const avatarURL = path.join("/avatars", `${_id}.${fileType}`); // Create the URL for the avatar
            
            // Update the user's avatarURL in the database
            const user = await User.findByIdAndUpdate(
                { _id },
                { avatarURL },
                 {new: true, }
            );
            if (!user) {
                return res.status(401).json({ message: "Not Authorized" }); // If user is not found, return an unauthorized status
            };
            return res.json({
                avatarURL: user.avatarURL,  // Respond with the updated avatar URL
            })
            
        } catch (err) {
            console.error('Error updating avatar:', err);
            res.status(500).json({ message: "Error updating avatar" });
            return;
        };
    },
};
module.exports = usersControllers;