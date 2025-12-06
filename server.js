import express from 'express';
import fetch from 'node-fetch'; // npm install node-fetch

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_URL = 

app.get('/data', async (req, res) => {
  try {
    const response = await fetch(DATA_URL);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load data' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
