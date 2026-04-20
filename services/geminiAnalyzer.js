const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeCV(cvText) {
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `
You are an expert CV analyzer. Analyze the following CV text and return a JSON object only (no markdown, no extra text).

CV Text:
"""
${cvText}
"""

Return this exact JSON structure:
{
  "name": "candidate full name or null",
  "email": "email or null",
  "phone": "phone or null",
  "years_of_experience": <number or 0>,
  "field_of_work": "one of: software_developer, accountant, financial_manager, legal_editor, data_analyst, content_writer, life_coach, online_teacher, graphic_designer, digital_artist, project_manager, customer_service, sign_language_interpreter, quality_assurance, photographer, musician, researcher, translator, psychologist, social_media_manager, tax_consultant, it_specialist, data_scientist, legal_consultant, academic_researcher",
  "skills": ["skill1", "skill2"],
  "disability_type": "one of: Limb Amputation, Visual Disability, Hearing Disability, Motor Disability, Chronic Illness, Epilepsy & Neurological Conditions, High-Functioning Autism & Asperger, Spinal & Chronic Pain Disorders — or null if not mentioned",
  "cv_improvements": [
    "improvement suggestion 1 in Arabic",
    "improvement suggestion 2 in Arabic",
    "improvement suggestion 3 in Arabic"
  ],
  "summary": "brief professional summary in Arabic"
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // تنظيف الـ response وparse الـ JSON
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}

module.exports = { analyzeCV };