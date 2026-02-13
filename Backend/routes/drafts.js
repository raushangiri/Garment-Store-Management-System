const express = require('express');
const router = express.Router();
const {
  getDrafts,
  getDraft,
  createDraft,
  updateDraft,
  deleteDraft
} = require('../controllers/draftController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getDrafts)
  .post(createDraft);

router.route('/:id')
  .get(getDraft)
  .put(updateDraft)
  .delete(deleteDraft);

module.exports = router;
