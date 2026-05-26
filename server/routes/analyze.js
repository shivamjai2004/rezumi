const express = require('express');
const router = express.Router();
const multer = require('multer');
const protect = require('../middleware/auth');
const { analyzeText, analyzePDF, extractPDFText } = require('../controllers/analyzeController');


// Store file in memory (no disk storage needed)
const upload = multer({ storage: multer.memoryStorage() });

router.use(protect);

router.post('/text', analyzeText);
router.post('/pdf', upload.single('resume'), analyzePDF);
router.post('/extract-pdf', upload.single('resume'), extractPDFText);

module.exports = router;