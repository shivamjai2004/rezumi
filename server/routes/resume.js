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
router.post('/:id/export-docx', require('../controllers/docxController'));
router.post('/parse-text', async (req, res) => {
  try {
    const { plainText } = req.body
    const { parseTextToResume } = require('../utils/gemini')
    const parsed = await parseTextToResume(plainText)
    res.json(parsed)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router;