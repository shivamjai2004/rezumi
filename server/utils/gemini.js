const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Helper to clean JSON response
const cleanJSON = (text) => {
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
};

// Helper to call Groq
const callAI = async (prompt) => {
  const response = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: prompt }],
  });
  return response.choices[0].message.content;
};

// 1. Enhance resume content (Form mode)
const enhanceResumeContent = async (rawData) => {
  const prompt = `
    You are an expert resume writer. Enhance the following resume content 
    to be ATS-friendly, action-verb led, and impactful.
    Improve the summary, experience descriptions, and project descriptions.
    Return ONLY a valid JSON object with exact same structure as input but improved content.
    No markdown, no backticks, just pure JSON.
    Input: ${JSON.stringify(rawData)}
  `;
  const text = await callAI(prompt);
  return cleanJSON(text);
};

// 2. Plain text to structured resume (Text mode)
const parseTextToResume = async (plainText) => {
  const prompt = `
    Extract and structure the following text into a resume JSON with these exact fields:
    {
      "personalInfo": { "name": "", "email": "", "phone": "", "location": "", "linkedin": "", "github": "", "summary": "" },
      "education": [{ "institution": "", "degree": "", "field": "", "startYear": "", "endYear": "", "grade": "" }],
      "experience": [{ "company": "", "role": "", "startDate": "", "endDate": "", "description": "" }],
      "skills": [],
      "projects": [{ "name": "", "description": "", "techStack": "", "link": "" }]
    }
    IMPORTANT RULES:
    - Return ONLY valid JSON, no markdown, no backticks, no extra text
    - Every field must be a plain string, never an object or array within a field
    - "link" in projects must be a single URL string like "https://github.com/user/repo" or empty string ""
    - "skills" must be a flat array of strings like ["React", "Node.js"]
    - If a field is not found, use empty string ""
    Input: ${plainText}
  `;
  const text = await callAI(prompt);
  return cleanJSON(text);
};

// 3. Resume vs Job Description analysis
const analyzeResumeMatch = async (resumeText, jobDescription) => {
  const prompt = `
    You are an ATS expert. Compare this resume with the job description.
    Return ONLY a JSON object with:
    {
      "matchScore": 0-100,
      "matchedKeywords": [],
      "missingKeywords": [],
      "suggestions": [],
      "strengths": [],
      "overallFeedback": ""
    }
    No markdown, no backticks, just pure JSON.
    Resume: ${resumeText}
    Job Description: ${jobDescription}
  `;
  const text = await callAI(prompt);
  return cleanJSON(text);
};

module.exports = { enhanceResumeContent, parseTextToResume, analyzeResumeMatch };