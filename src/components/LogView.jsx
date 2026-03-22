import { useState } from 'react'
import styles from './LogView.module.css'

export default function LogView({ onAnalyze, loading }) {
  const [text, setText] = useState('')

  const handleAnalyze = () => {
    if (!text.trim()) return
    onAnalyze(`Analyze these logs and give me root cause + fix:\n\`\`\`\n${text}\n\`\`\``)
  }

  const lineCount = text.length > 0 ? text.split('\n').length : 0

  return (
    <div className={styles.view}>
      <h2 className={styles.head}>Log Analyzer</h2>
      <p className={styles.sub}>
        Paste raw output from kubectl, docker logs, systemd, nginx, or any
        application.
        <br />
        The AI will identify the root cause and tell you exactly what to fix.
      </p>

      <textarea
        className={styles.ta}
        placeholder={
          '# Paste logs here\n\nkubectl describe pod <name>\ndocker logs <container> --tail 200\njournalctl -u <service> -n 100\n\nor any stack trace / error output'
        }
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className={styles.footer}>
        <button
          className={styles.analyzeBtn}
          onClick={handleAnalyze}
          disabled={!text.trim() || loading}
        >
          {loading ? 'Analyzing…' : 'Analyze'}
        </button>
        <button className={styles.ghostBtn} onClick={() => setText('')}>
          Clear
        </button>
        {lineCount > 0 && (
          <span className={styles.meta}>{lineCount} lines</span>
        )}
      </div>
    </div>
  )
}
