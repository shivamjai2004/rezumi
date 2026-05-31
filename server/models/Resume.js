const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { type: String, default: 'My Resume' },
  personalInfo: {
    name: String, email: String, phone: String,
    location: String, linkedin: String, github: String, summary: String
  },
  education: [{
    institution: String, degree: String, field: String,
    startYear: String, endYear: String, grade: String
  }],
  experience: [{
    company: String, role: String,
    startDate: String, endDate: String, description: String
  }],
  skills: [String],
  projects: [{
    name: String, description: String, techStack: String, link: String
  }],
  template: { type: String, default: 'modern' },
  isPublic:  { type: Boolean, default: false },
  shareId:   { type: String, unique: true, sparse: true }
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);