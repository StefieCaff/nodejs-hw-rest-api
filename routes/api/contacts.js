const router = require('express').Router();

router.route('/').get().post();
router.route('/:contactId').get().delete().put();
router.route('/:contactId/favorite').patch();

module.exports = router;
