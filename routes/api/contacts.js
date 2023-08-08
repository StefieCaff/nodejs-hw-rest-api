const router = require('express').Router();

const {
    getContacts,
    createContact,
    getSingleContact,
    deleteContact,
    updateContact
} = require('../../controllers')

router.route('/')
    .get(getContacts)
    .post(createContact);

router.route('/:contactId')
    .get(getSingleContact)
    .delete(deleteContact)
    .put(updateContact);

router.route('/:contactId/favorite')
    .patch();

module.exports = router;
