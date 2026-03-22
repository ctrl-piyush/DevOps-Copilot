import { useRef, useEffect } from 'react'
import MdContent from './MdContent'
import { SAMPLES, CHIPS } from '../lib/samples'
import styles from './ChatView.module.css'

function ThinkingDots() {
  return (
    <div className={styles.thinking}>
      <span /><span /><span />
    </div>
  )
}

function Message({ msg }) {
  return (
    <div className={styles.msg}>
      <div className={`${styles.who} ${msg.role === 'user' ? styles.isUser : ''}`}>
        {msg.role === 'user' ? 'you' : 'copilot'}
      </div>

      {msg.role === 'user' ? (
        <div className={styles.userBubble}>{msg.content}</div>
      ) : msg.streaming && !msg.content ? (
        <ThinkingDots />
      ) : (
        <>
          <MdContent text={msg.content} />
          {msg.streaming && <span className={styles.cursor} />}
        </>
      )}
    </div>
  )
}

function EmptyState({ onSend }) {
  return (
    <div className={styles.empty}>
      <h1 className={styles.emptyHead}>What&apos;s broken?</h1>
      <p className={styles.emptySub}>
        Describe your incident, paste a stack trace, or pick an example from the
        sidebar. I&apos;ll give you root cause analysis and a fix.
      </p>
      <div className={styles.emptyCards}>
        {SAMPLES.map((s) => (
          <div key={s.id} className={styles.ecard} onClick={() => onSend(s.prompt)}>
            <div className={styles.ecardTitle}>{s.title}</div>
            <div className={styles.ecardDesc}>{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ChatView({ messages, loading, onSend }) {
  const scrollRef = useRef(null)
  const inputRef = useRef(null)
  const inputValRef = useRef('')

  // track input value without re-renders
  const handleInput = (e) => {
    inputValRef.current = e.target.value
    // auto-resize
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'
  }

  const submit = () => {
    const val = inputValRef.current.trim()
    if (!val || loading) return
    onSend(val)
    if (inputRef.current) {
      inputRef.current.value = ''
      inputRef.current.style.height = 'auto'
      inputValRef.current = ''
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const useChip = (text) => {
    if (inputRef.current) {
      inputRef.current.value = text
      inputValRef.current = text
      inputRef.current.focus()
    }
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <>
      <div className={styles.scroll} ref={scrollRef}>
        <div className={styles.inner}>
          {messages.length === 0 ? (
            <EmptyState onSend={onSend} />
          ) : (
            messages.map((msg) => <Message key={msg.id} msg={msg} />)
          )}
        </div>
      </div>

      <div className={styles.inputWrap}>
        <div className={styles.inputInner}>
          <div className={styles.inputRow}>
            <textarea
              ref={inputRef}
              className={styles.inputBox}
              placeholder="Describe the issue or paste logs..."
              onInput={handleInput}
              onKeyDown={handleKey}
              rows={1}
            />
            <button
              className={styles.sendBtn}
              onClick={submit}
              disabled={loading}
            >
              ↑
            </button>
          </div>
          <div className={styles.chips}>
            {CHIPS.map((c) => (
              <button key={c} className={styles.chip} onClick={() => useChip(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
