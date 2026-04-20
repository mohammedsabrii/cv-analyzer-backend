const supabase = require('./supabaseClient');

async function extractTextFromSupabase(filePath) {
  const { data, error } = await supabase.storage
    .from('cvs')
    .download(filePath);

  if (error) throw new Error(`Supabase download error: ${error.message}`);

  const arrayBuffer = await data.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // ✅ import جوه الfunction مباشرة
  const pdfParse = require('pdf-parse/lib/pdf-parse.js');
  const pdfData = await pdfParse(buffer);
  return pdfData.text;
}

module.exports = { extractTextFromSupabase };