import { useState, useCallback } from 'react'
import { streamMessage } from '../lib/claude'
import { supabase } from '../lib/supabase'

export function useChat() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const saveConversation = async (msgs) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('conversations').upsert({
      user_id: user.id,
      title: msgs[0]?.content?.slice(0, 50) || 'Untitled',
      messages: msgs,
    })
  }

  const send = useCallback(
    async (text) => {
      if (!text.trim() || loading) return

      const uid = Date.now()
      const aid = uid + 1

      setMessages((prev) => [
        ...prev,
        { role: 'user', content: text, id: uid },
        { role: 'assistant', content: '', id: aid, streaming: true },
      ])
      setLoading(true)

      try {
        const history = [...messages, { role: 'user', content: text }]
        let finalMessages

        await streamMessage(history, (chunk) => {
          setMessages((prev) => {
            const updated = prev.map((m) =>
              m.id === aid ? { ...m, content: chunk } : m
            )
            finalMessages = updated
            return updated
          })
        })

        setMessages((prev) => {
          const updated = prev.map((m) =>
            m.id === aid ? { ...m, streaming: false } : m
          )
          finalMessages = updated
          return updated
        })

        // save to Supabase after response is complete
        if (finalMessages) await saveConversation(finalMessages)

      } catch (e) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aid
              ? { ...m, content: `**Error:** ${e.message}`, streaming: false }
              : m
          )
        )
      }

      setLoading(false)
    },
    [messages, loading]
  )

  const clear = useCallback(() => setMessages([]), [])

  return { messages, loading, send, clear }
}