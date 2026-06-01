const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const cleanJSON = (text) => {
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
};

const callAI = async (prompt) => {
  const response = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: prompt }],
  });
  return response.choices[0].message.content;
};

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

const scoreResumeCard = async (resume) => {
  const resumeText = JSON.stringify(resume);
  const prompt = `
    You are an expert resume reviewer. Score this resume on exactly 5 criteria.
    Return ONLY a valid JSON object with this exact structure, no markdown, no backticks:
    {
      "overall": <number 0-100>,
      "criteria": [
        { "name": "ATS Compatibility", "score": <0-100>, "icon": "🤖", "feedback": "<one sentence tip>" },
        { "name": "Impact & Achievements", "score": <0-100>, "icon": "🎯", "feedback": "<one sentence tip>" },
        { "name": "Skills Relevance", "score": <0-100>, "icon": "🛠️", "feedback": "<one sentence tip>" },
        { "name": "Clarity & Readability", "score": <0-100>, "icon": "📖", "feedback": "<one sentence tip>" },
        { "name": "Format & Structure", "score": <0-100>, "icon": "📐", "feedback": "<one sentence tip>" }
      ],
      "topSuggestions": ["<tip 1>", "<tip 2>", "<tip 3>"]
    }
    Be honest and specific. Score based on actual resume content.
    Resume data: ${resumeText}
  `;
  const text = await callAI(prompt);
  return cleanJSON(text);
};

module.exports = { enhanceResumeContent, parseTextToResume, analyzeResumeMatch, scoreResumeCard };