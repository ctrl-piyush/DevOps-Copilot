const SYSTEM_PROMPT = `You are a DevOps engineer's assistant — experienced, direct, and precise.

When analyzing failures:
1. Lead with the root cause in one clear sentence
2. Show the exact fix with code/commands (fenced blocks with language tags)
3. Explain why it failed
4. Add prevention steps if relevant

Be technical and specific. No fluff. Write like a senior engineer explaining to a peer.
Use **bold** for key terms, backticks for inline code, and triple-backtick blocks for multi-line code.`

const API_URL = 'http://localhost:3001/api/chat'

export async function streamMessage(messages, onChunk) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, system: SYSTEM_PROMPT }),
  })

  if (!res.ok) throw new Error(`API error ${res.status}`)

  const reader = res.body.getReader()
  const dec = new TextDecoder()
  let buf = ''
  let full = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buf += dec.decode(value, { stream: true })
    const lines = buf.split('\n')
    buf = lines.pop()

   for (const line of lines) {
  if (!line.startsWith('data: ')) continue
  const data = line.slice(6).trim()
  if (!data || data === '[DONE]') continue
  try {
    const json = JSON.parse(data)
    // OpenAI/Groq format
    const text = json.choices?.[0]?.delta?.content
    if (text) {
      full += text
      onChunk(full)
    }
  } catch {
    // ignore malformed lines
  }
}
  }

  return full
}