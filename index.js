const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { OpenAI } = require('openai');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const miri = JSON.parse(fs.readFileSync('miri_core.json', 'utf8'));
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/chat', async (req, res) => {
  try {
    const messages = [
      { role: 'system', content: `あなたは ${miri.name}。${miri.persona}` },
      { role: 'user', content: req.body.message }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: 'Failed to respond', detail: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Miri server running on port ${PORT}`);
});
