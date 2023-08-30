const router = require('express').Router();
const auth = require('../../utils/auth');
const upload = require('../../utils/upload');
// contacts controller
const {
    getContacts,
    createContact,
    getSingleContact,
    deleteContact,
    updateContact,
    addToFavorites,
} = require('../../controllers/contacts/contacts');
// users controller
const {
    signup,
    login,
    logout,
    getCurrentUser,
    updateSubscription,
    updateAvatar,
    authorizeEmail,
    verifyUser,
    reSendVerificationEmail,
} = require('../../controllers/users/users');

//* CONTACT ROUTES
router.route('/')
    .get(auth, getContacts)
    .post(auth, createContact);
router.route('/:contactId')
    .get(auth, getSingleContact)
    .delete(auth, deleteContact)
    .put(auth, updateContact);
router.route('/:contactId/favorite').patch(auth, addToFavorites);

//* USER ROUTES
router.route('/users/signup').post(signup);
router.route('/users/login').post(login);
router.route('/users/logout').post(logout);
router.route('/users/current').get(auth, getCurrentUser);
router.route('/users/subscription/:userId').patch(auth, updateSubscription);
router.route('/users/avatar').patch(auth, upload.single('avatar'), updateAvatar);
router.route('/users/verify/:verificationToken').get(auth, verifyUser);
router.route('/auth/verify/:verificationToken').get(auth, verifyUser);
router.route('/users/verify').post(reSendVerificationEmail);
module.exports = router;
