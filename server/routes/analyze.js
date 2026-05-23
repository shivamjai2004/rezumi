const express = require('express');
const router = express.Router();
const multer = require('multer');
const protect = require('../middleware/auth');
const { analyzeText, analyzePDF } = require('../controllers/analyzeController');

// Store file in memory (no disk storage needed)
const upload = multer({ storage: multer.memoryStorage() });

router.use(protect);

router.post('/text', analyzeText);
router.post('/pdf', upload.single('resume'), analyzePDF);

module.exports = router;