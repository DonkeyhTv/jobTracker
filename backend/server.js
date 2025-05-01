const express = require('express')
const { Client } = require('pg')

const app = express()
const port = 5000

const client = new Client({
  user: 'steve',
  host: 'localhost',
  database: 'search',
  password: 'Gticrew11!!',
  port: 5432,
})

client.connect()

app.get('/test', async (req, res) => {
  try {
    const result = await client.query('SELECT NOW()')
    res.json(result.rows)
  } catch (err) {
    console.error('Error executing query', err.stack)
    res.status(500).send('Database query failed')
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
