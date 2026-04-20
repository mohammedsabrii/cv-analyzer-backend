const express = require('express');
const router = express.Router();
const { extractTextFromSupabase } = require('../services/pdfExtractor');
const { analyzeCV } = require('../services/groqApiAnalyzer');
const { matchJobs } = require('../services/jobMatcher');

// POST /api/analyze
router.post('/analyze', async (req, res) => {
  try {
    const { file_path, language } = req.body; 
    const lang = language === 'ar' ? 'Arabic' : 'English';

    const cvText = await extractTextFromSupabase(file_path);
    const cvAnalysis = await analyzeCV(cvText, lang); 
    const matchedJobs = await matchJobs(cvAnalysis);

    return res.json({
      success: true,
      cv_analysis: cvAnalysis,
      matched_jobs: matchedJobs,
      total_jobs_found: matchedJobs.length,
    });
  } catch (err) {
    console.error('❌ Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;