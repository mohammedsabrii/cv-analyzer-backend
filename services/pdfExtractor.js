const pdfParse = require('pdf-parse');
const supabase = require('./supabaseClient');

async function extractTextFromSupabase(filePath) {
  const { data, error } = await supabase.storage
    .from('cvs')
    .download(filePath);

  if (error) throw new Error(`Supabase download error: ${error.message}`);

  const arrayBuffer = await data.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // ✅ الحل: استخدام pdfParse مباشرة مش pdf
  const pdfData = await pdfParse(buffer);
  return pdfData.text;
}

module.exports = { extractTextFromSupabase };