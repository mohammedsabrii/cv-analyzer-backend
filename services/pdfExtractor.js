const supabase = require('./supabaseClient');

async function extractTextFromSupabase(filePath) {
  const { data, error } = await supabase.storage
    .from('cvs')
    .download(filePath);

  if (error) throw new Error(`Supabase download error: ${error.message}`);

  const arrayBuffer = await data.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // استخدام pdfjs-dist
  const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
  pdfjsLib.GlobalWorkerOptions.workerSrc = false;

  const loadingTask = pdfjsLib.getDocument({ data: buffer });
  const pdfDocument = await loadingTask.promise;

  let fullText = '';
  for (let i = 1; i <= pdfDocument.numPages; i++) {
    const page = await pdfDocument.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item) => item.str).join(' ');
    fullText += pageText + '\n';
  }

  return fullText;
}

module.exports = { extractTextFromSupabase };