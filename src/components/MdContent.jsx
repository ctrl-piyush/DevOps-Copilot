import styles from './MdContent.module.css'

/**
 * Renders a minimal subset of markdown:
 * - fenced code blocks
 * - **bold**, `inline code`
 * - ## headings
 * - bullet lists
 * - horizontal rules
 */
export default function MdContent({ text }) {
  const parts = []
  const re = /```(\w*)\n?([\s\S]*?)```/g
  let last = 0
  let m

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ t: 'text', v: text.slice(last, m.index) })
    parts.push({ t: 'code', lang: m[1], v: m[2].trim() })
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push({ t: 'text', v: text.slice(last) })

  return (
    <div className={styles.body}>
      {parts.map((p, i) => {
        if (p.t === 'code') {
          return (
            <pre key={i} className={styles.pre}>
              <code>{p.v}</code>
            </pre>
          )
        }

        const html = p.v
          .replace(/^### (.+)$/gm, '<h3>$1</h3>')
          .replace(/^## (.+)$/gm, '<h2>$1</h2>')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/`([^`]+)`/g, '<code>$1</code>')
          .replace(/^---$/gm, '<hr/>')
          .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
          .replace(/(<li>[^]*?<\/li>)/g, '<ul>$1</ul>')
          .split(/\n\n+/)
          .map((chunk) =>
            chunk.startsWith('<') ? chunk : `<p>${chunk.replace(/\n/g, '<br/>')}</p>`
          )
          .join('')

        return (
          <span key={i} dangerouslySetInnerHTML={{ __html: html }} />
        )
      })}
    </div>
  )
}
