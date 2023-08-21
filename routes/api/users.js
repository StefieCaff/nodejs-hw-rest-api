// something isn't working when i separate out the user routes...

const router = require('express').Router();
const auth = require('../../utils/auth');
const upload = require('../../utils/upload');

const {
    signup,
    login,
    logout,
    getCurrentUser,
    updateSubscription,
    updateAvatar,
} = require('../../controllers/users/users');

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/logout').post(logout);
router.route('/current').get(auth, getCurrentUser);
router.route('/:userId').patch(auth, updateSubscription);
router.route('/avatar').patch(auth, upload.single('avatar'), updateAvatar);

module.exports = router;