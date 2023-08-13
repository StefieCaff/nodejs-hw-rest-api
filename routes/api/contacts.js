const router = require('express').Router();

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
} = require('../../controllers/users/users');

//* CONTACT ROUTES
router.route('/')
    .get(getContacts)
    .post(createContact);
router.route('/:contactId')
    .get(getSingleContact)
    .delete(deleteContact)
    .put(updateContact);
router.route('/:contactId/favorite').patch(addToFavorites);

//* USER ROUTES
router.route('/users/signup').post(signup);
router.route('/users/login').post();
router.route('users/logout').post();
router.route('users/current').post();
router.route('/:userId/users').patch();

module.exports = router;
