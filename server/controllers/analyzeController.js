const pdfParse = require('pdf-parse');
const { analyzeResumeMatch } = require('../utils/gemini');

// Analyze resume text vs job description
const analyzeText = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription)
      return res.status(400).json({ message: 'Resume text and job description are required' });

    const analysis = await analyzeResumeMatch(resumeText, jobDescription);
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Analyze uploaded PDF vs job description
const analyzePDF = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: 'PDF file is required' });

    const { jobDescription } = req.body;
    if (!jobDescription)
      return res.status(400).json({ message: 'Job description is required' });

    // Extract text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    const analysis = await analyzeResumeMatch(resumeText, jobDescription);
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { analyzeText, analyzePDF };