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


router.route('/')
    .get(auth, getContacts)
    .post(auth, createContact);
router.route('/:contactId')
    .get(auth, getSingleContact)
    .delete(auth, deleteContact)
    .put(auth, updateContact);
router.route('/:contactId/favorite').patch(auth, addToFavorites);

module.exports = router;
