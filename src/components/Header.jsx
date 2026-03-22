import styles from './Header.module.css'

export default function Header({ tab, onTabChange }) {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <span className={styles.dot} />
        DevOps Copilot
      </div>

      <nav className={styles.nav}>
        {['chat', 'logs'].map((t) => (
          <button
            key={t}
            className={`${styles.navBtn} ${tab === t ? styles.active : ''}`}
            onClick={() => onTabChange(t)}
          >
            {t === 'chat' ? 'Chat' : 'Log Analyzer'}
          </button>
        ))}
      </nav>

      <div className={styles.right}>
        <div className={styles.pill}>
          <span className={`${styles.pillDot} ${styles.warn}`} />
          Cluster degraded
        </div>
        <div className={styles.pill}>
          <span className={styles.pillDot} />
          1 incident open
        </div>
      </div>
    </header>
  )
}
