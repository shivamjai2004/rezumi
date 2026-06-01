const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const crypto = require('crypto');
const Resume = require('../models/Resume');
const {
  createResumeFromForm, createResumeFromText,
  getMyResumes, getResumeById, updateResume, deleteResume
} = require('../controllers/resumeController');

// Public — no auth
router.get('/public/:shareId', async (req, res) => {
  try {
    const resume = await Resume.findOne({ shareId: req.params.shareId, isPublic: true }).select('-user');
    if (!resume) return res.status(404).json({ message: 'Resume not found or not public' });
    res.json(resume);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Protected — auth required
router.use(protect);

router.get('/', getMyResumes);
router.post('/form', createResumeFromForm);
router.post('/text', createResumeFromText);
router.get('/:id', getResumeById);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);
router.post('/:id/export-docx', require('../controllers/docxController'));

router.post('/parse-text', async (req, res) => {
  try {
    const { plainText } = req.body;
    const { parseTextToResume } = require('../utils/gemini');
    const parsed = await parseTextToResume(plainText);
    res.json(parsed);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Generate share link
router.post('/:id/share', async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    if (!resume.shareId) resume.shareId = crypto.randomBytes(8).toString('hex');
    resume.isPublic = true;
    await resume.save();
    res.json({ shareId: resume.shareId, isPublic: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Revoke share link
router.delete('/:id/share', async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    resume.isPublic = false;
    resume.shareId = undefined;
    await resume.save();
    res.json({ isPublic: false });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// AI Resume Score Card
router.post('/:id/score', async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    const { scoreResumeCard } = require('../utils/gemini');
    const scoreCard = await scoreResumeCard(resume);
    res.json(scoreCard);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;