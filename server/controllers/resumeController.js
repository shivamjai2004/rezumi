const Resume = require('../models/Resume');
const { enhanceResumeContent, parseTextToResume } = require('../utils/gemini');

// Create resume from form data (with AI enhancement)
const createResumeFromForm = async (req, res) => {
  try {
    const resumeData = req.body;

    // Enhance with AI
    const enhanced = await enhanceResumeContent(resumeData);

    const resume = await Resume.create({
      user: req.user.id,
      title: resumeData.title || 'My Resume',
      personalInfo: enhanced.personalInfo || resumeData.personalInfo,
      education: enhanced.education || resumeData.education,
      experience: enhanced.experience || resumeData.experience,
      skills: enhanced.skills || resumeData.skills,
      projects: enhanced.projects || resumeData.projects,
    });

    res.status(201).json(resume);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create resume from plain text (with AI parsing)
const createResumeFromText = async (req, res) => {
  try {
    const { plainText, title } = req.body;

    if (!plainText) return res.status(400).json({ message: 'Plain text is required' });

    // Parse with AI
    const parsed = await parseTextToResume(plainText);

    const resume = await Resume.create({
      user: req.user.id,
      title: title || 'My Resume',
      ...parsed
    });

    res.status(201).json(resume);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all resumes of logged in user
const getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single resume
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    if (resume.user.toString() !== req.user.id)
      return res.status(401).json({ message: 'Not authorized' });
    res.json(resume);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update resume
const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    if (resume.user.toString() !== req.user.id)
      return res.status(401).json({ message: 'Not authorized' });

    const updated = await Resume.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete resume
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    if (resume.user.toString() !== req.user.id)
      return res.status(401).json({ message: 'Not authorized' });

    await resume.deleteOne();
    res.json({ message: 'Resume deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createResumeFromForm,
  createResumeFromText,
  getMyResumes,
  getResumeById,
  updateResume,
  deleteResume
};