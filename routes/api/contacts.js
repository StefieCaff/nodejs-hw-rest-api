const router = require('express').Router();

const {
    getContacts,
    createContact,
    getSingleContact,
    deleteContact,
    updateContact,
    addToFavorites,
} = require('../../controllers/contacts/contacts')

router.route('/')
    .get(getContacts)
    .post(createContact);

router.route('/:contactId')
    .get(getSingleContact)
    .delete(deleteContact)
    .put(updateContact);

router.route('/:contactId/favorite')
    .patch(addToFavorites);

module.exports = router;
