const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
  createResumeFromForm,
  createResumeFromText,
  getMyResumes,
  getResumeById,
  updateResume,
  deleteResume
} = require('../controllers/resumeController');

router.use(protect); // all resume routes are protected

router.get('/', getMyResumes);
router.post('/form', createResumeFromForm);
router.post('/text', createResumeFromText);
router.get('/:id', getResumeById);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);

module.exports = router;