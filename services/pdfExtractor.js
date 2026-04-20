const pdf = require('pdf-parse');
const supabase = require('./supabaseClient');

async function extractTextFromSupabase(filePath) {
  // تحميل الملف من Supabase Storage
  const { data, error } = await supabase.storage
    .from('cvs')
    .download(filePath);

  if (error) throw new Error(`Supabase download error: ${error.message}`);

  // تحويل الـ Blob لـ Buffer
  const arrayBuffer = await data.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // استخراج النص
  const pdfData = await pdf(buffer);
  return pdfData.text;
}

module.exports = { extractTextFromSupabase };