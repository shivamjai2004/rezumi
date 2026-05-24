const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx');
const Resume = require('../models/Resume');

module.exports = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    const { personalInfo, education, experience, skills, projects } = resume;

    const doc = new Document({
      sections: [{
        children: [
          // Name
          new Paragraph({
            text: personalInfo?.name || 'Your Name',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),

          // Contact
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: [personalInfo?.email, personalInfo?.phone, personalInfo?.location].filter(Boolean).join(' | '), size: 20 })
            ]
          }),

          new Paragraph({ text: '' }),

          // Summary
          ...(personalInfo?.summary ? [
            new Paragraph({ text: 'SUMMARY', heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: personalInfo.summary }),
            new Paragraph({ text: '' }),
          ] : []),

          // Education
          ...(education?.length > 0 ? [
            new Paragraph({ text: 'EDUCATION', heading: HeadingLevel.HEADING_2 }),
            ...education.map(edu => new Paragraph({
              children: [
                new TextRun({ text: `${edu.degree} in ${edu.field} - ${edu.institution}`, bold: true }),
                new TextRun({ text: `  ${edu.startYear} - ${edu.endYear || 'Present'}` }),
              ]
            })),
            new Paragraph({ text: '' }),
          ] : []),

          // Experience
          ...(experience?.filter(e => e.company).length > 0 ? [
            new Paragraph({ text: 'EXPERIENCE', heading: HeadingLevel.HEADING_2 }),
            ...experience.filter(e => e.company).flatMap(exp => [
              new Paragraph({
                children: [
                  new TextRun({ text: `${exp.role} at ${exp.company}`, bold: true }),
                  new TextRun({ text: `  ${exp.startDate} - ${exp.endDate || 'Present'}` }),
                ]
              }),
              new Paragraph({ text: exp.description || '' }),
            ]),
            new Paragraph({ text: '' }),
          ] : []),

          // Skills
          ...(skills?.length > 0 ? [
            new Paragraph({ text: 'SKILLS', heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: skills.join(', ') }),
            new Paragraph({ text: '' }),
          ] : []),

          // Projects
          ...(projects?.filter(p => p.name).length > 0 ? [
            new Paragraph({ text: 'PROJECTS', heading: HeadingLevel.HEADING_2 }),
            ...projects.filter(p => p.name).flatMap(proj => [
              new Paragraph({ children: [new TextRun({ text: proj.name, bold: true })] }),
              new Paragraph({ text: `Tech: ${proj.techStack || ''}` }),
              new Paragraph({ text: proj.description || '' }),
            ]),
          ] : []),
        ]
      }]
    });

    const buffer = await Packer.toBuffer(doc);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename=resume.docx`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};