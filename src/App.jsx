import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ChatView from './components/ChatView'
import LogView from './components/LogView'
import { useChat } from './hooks/useChat'
import styles from './App.module.css'

export default function App() {
  const [session, setSession] = useState(null)
  const [tab, setTab] = useState('chat')
  const { messages, loading, send } = useChat()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    supabase.auth.onAuthStateChange((_e, session) => setSession(session))
  }, [])

  if (!session) return <Auth />

  const handleSelectSample = (sample) => {
    setTab('chat')
    send(sample.prompt)
  }

  const handleAnalyzeLogs = (prompt) => {
    setTab('chat')
    send(prompt)
  }

  return (
    <div className={styles.shell}>
      <Header tab={tab} onTabChange={setTab} />
      <Sidebar onSelectSample={handleSelectSample} />
      <main className={styles.main}>
        {tab === 'chat' && (
          <ChatView messages={messages} loading={loading} onSend={send} />
        )}
        {tab === 'logs' && (
          <LogView onAnalyze={handleAnalyzeLogs} loading={loading} />
        )}
      </main>
    </div>
  )
}