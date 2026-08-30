const { askGemini } = require('../lib/gemini');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { question, history } = req.body || {};
    const answer = await askGemini(question, history);
    return res.status(200).json({ answer });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || 'Something went wrong while contacting Gemini.'
    });
  }
};
