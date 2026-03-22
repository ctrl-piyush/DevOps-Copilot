import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = 3001

app.use(cors({ origin: ['http://localhost:5173', 'https://your-app.vercel.app' ]}))
app.use(express.json())

app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY not set in .env' })
  }

  const { messages, system } = req.body

  try {
    const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: system },
          ...messages.map(m => ({ role: m.role, content: m.content})),
        ],
        stream: true,
        max_tokens: 1600,
      }),
    })

    if (!upstream.ok) {
      const errText = await upstream.text()
      console.error('Groq error:', upstream.status, errText)
      return res.status(upstream.status).json({ error: errText })
    }

    res.status(200)
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')

    const reader = upstream.body.getReader()
    while (true) {
      const { done, value } = await reader.read()
      if (done) { res.end(); break }
      res.write(value)
    }
  } catch (err) {
    console.error('Proxy error:', err)
    res.status(502).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`\n  DevOps Copilot proxy running on http://localhost:${PORT}\n`)
})