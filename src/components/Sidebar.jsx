import { SAMPLES } from '../lib/samples'
import styles from './Sidebar.module.css'

const STATUS_ITEMS = [
  { label: 'All incidents',      count: '1', red: true  },
  { label: 'Open alerts',        count: '3', red: false },
  { label: 'Failing pipelines',  count: '1', red: true  },
  { label: 'Services degraded',  count: '2', red: false },
]

const TAG_LABEL = {
  k8s: 'kubernetes',
  ci:  'ci/cd',
  db:  'database',
  mem: 'memory',
}

export default function Sidebar({ onSelectSample }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.label}>Status</div>

      {STATUS_ITEMS.map((item) => (
        <div key={item.label} className={styles.item}>
          <span>{item.label}</span>
          <span className={`${styles.count} ${item.red ? styles.red : ''}`}>
            {item.count}
          </span>
        </div>
      ))}

      <div className={styles.divider} />

      <div className={styles.label}>Try an example</div>

      {SAMPLES.map((s) => (
        <div
          key={s.id}
          className={styles.scenario}
          onClick={() => onSelectSample(s)}
        >
          <div className={styles.scenarioTitle}>{s.title}</div>
          <div className={styles.scenarioSub}>{s.sub}</div>
          <span className={`${styles.tag} ${styles[`tag_${s.tag}`]}`}>
            {TAG_LABEL[s.tag]}
          </span>
        </div>
      ))}
    </aside>
  )
}
