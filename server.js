const express = require('express')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

// API: return data file
app.get('/api/data', (req, res) => {
  const file = path.join(__dirname, 'data', 'destinations.json')
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read data file' })
    try {
      res.json(JSON.parse(data))
    } catch (e) {
      res.status(500).json({ error: 'Failed to parse data file' })
    }
  })
})

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
