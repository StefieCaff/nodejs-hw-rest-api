const router = require('express').Router();

const {
    getContacts,
    createContact
} = require('../../controllers')

router.route('/').get(getContacts).post(createContact);
router.route('/:contactId').get().delete().put();
router.route('/:contactId/favorite').patch();

module.exports = router;
