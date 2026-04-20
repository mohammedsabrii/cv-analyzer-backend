const supabase = require('./supabaseClient');

async function matchJobs(cvAnalysis) {
  const { field_of_work, years_of_experience, disability_type } = cvAnalysis;

  // جلب الوظائف المناسبة
  let query = supabase
    .from('job_listings')
    .select('*');

  // الـ disability هو الشرط الأساسي
  if (disability_type) {
    query = query.contains('disabilities', [disability_type]);
  }

  // فلترة بالـ category لو موجود
  if (field_of_work) {
    query = query.eq('category', field_of_work);
  }

  const { data: jobs, error } = await query.limit(20);

  if (error) throw new Error(`Job matching error: ${error.message}`);

  // ترتيب الوظائف حسب الـ experience
  const scored = (jobs || []).map(job => {
    let score = 0;

    // disability match = +10 (أهم عامل)
    if (disability_type && job.disabilities?.includes(disability_type)) score += 10;

    // category match = +5
    if (field_of_work && job.category === field_of_work) score += 5;

    // experience match
    const jobExp = parseExperience(job.experience);
    if (years_of_experience >= jobExp.min && years_of_experience <= jobExp.max) score += 3;

    return { ...job, match_score: score };
  });

  return scored
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 10);
}

function parseExperience(expText) {
  if (!expText) return { min: 0, max: 99 };
  const numbers = expText.match(/\d+/g);
  if (!numbers) return { min: 0, max: 99 };
  if (numbers.length === 1) return { min: parseInt(numbers[0]), max: 99 };
  return { min: parseInt(numbers[0]), max: parseInt(numbers[1]) };
}

module.exports = { matchJobs };