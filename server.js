const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const fetch = require('node-fetch')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

app.get('/api/data', async (req, res) => {
  const url = 'https://raw.githubusercontent.com/GKZTECH/travel_budget_planner_full/refs/heads/main/data/destinations.json'
  try {
    const response = await fetch(url)
    const json = await response.json()
    res.json(json)
  } catch (err) {
    res.status(500).json({ error: 'Failed to load GitHub data' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
