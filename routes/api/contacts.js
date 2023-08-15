const router = require('express').Router();
const auth = require('../../utils/auth');
const {
    getContacts,
    createContact,
    getSingleContact,
    deleteContact,
    updateContact,
    addToFavorites,
} = require('../../controllers/contacts/contacts');

const {
    signup,
    login,
    logout,
    getCurrentUser,
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
router.route('/:userId/users').patch();

module.exports = router;
