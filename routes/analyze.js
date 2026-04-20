const express = require('express');
const router = express.Router();
const { extractTextFromSupabase } = require('../services/pdfExtractor');
const { analyzeCV } = require('../services/openaiAnalyzer');
const { matchJobs } = require('../services/jobMatcher');

// POST /api/analyze
router.post('/analyze', async (req, res) => {
  try {
    const { file_path } = req.body;

    if (!file_path) {
      return res.status(400).json({ error: 'file_path is required' });
    }

    console.log('📄 Extracting text from:', file_path);
    const cvText = await extractTextFromSupabase(file_path);

    if (!cvText || cvText.trim().length < 50) {
      return res.status(400).json({ error: 'Could not extract text from PDF' });
    }

    console.log('🤖 Analyzing with OpenAI...');
    const cvAnalysis = await analyzeCV(cvText);

    console.log('💼 Matching jobs...');
    const matchedJobs = await matchJobs(cvAnalysis);

    return res.json({
      success: true,
      cv_analysis: cvAnalysis,
      matched_jobs: matchedJobs,
      total_jobs_found: matchedJobs.length
    });

  } catch (err) {
    console.error('❌ Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;