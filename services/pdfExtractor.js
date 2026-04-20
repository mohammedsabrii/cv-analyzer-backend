const supabase = require('./supabaseClient');
const PDFParser = require('pdf2json');

async function extractTextFromSupabase(filePath) {
  const { data, error } = await supabase.storage
    .from('cvs')
    .download(filePath);

  if (error) throw new Error(`Supabase download error: ${error.message}`);

  const arrayBuffer = await data.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      const text = pdfData.Pages.map((page) =>
        page.Texts.map((t) => decodeURIComponent(t.R.map((r) => r.T).join(''))).join(' ')
      ).join('\n');
      resolve(text);
    });

    pdfParser.on('pdfParser_dataError', (err) => {
      reject(new Error(`PDF parse error: ${err.parserError}`));
    });

    pdfParser.parseBuffer(buffer);
  });
}

module.exports = { extractTextFromSupabase };