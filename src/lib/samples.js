export const SAMPLES = [
  {
    id: 'k8s',
    title: 'Pod OOMKilled',
    tag: 'k8s',
    sub: 'Kubernetes · production',
    prompt: `Analyze this Kubernetes pod failure and give me root cause + fix:

Pod: api-service-7d9f4b5c8-xk2v9
Namespace: production
Reason: OOMKilled  Exit Code: 137

Events:
  Warning  BackOff    5m    kubelet  Back-off restarting failed container
  Warning  OOMKilling 5m    kernel   Memory cgroup out of memory: Kill process 1234 (node) score 1847
  Normal   Started    6m    kubelet  Started container api-service

Container limits: memory=256Mi, cpu=200m
Memory before kill: 252Mi
Logs show spike during DB query batch.`,
  },
  {
    id: 'ci',
    title: 'GitHub Actions failing',
    tag: 'ci',
    sub: 'CI/CD · feature branch',
    prompt: `CI pipeline is blocking our deploy. Diagnose:

Repo: myorg/backend-api  Branch: feature/payment-gateway
Step: Run tests  Duration: 4m 32s

Error:
  FAIL src/services/payment.test.ts
  ● PaymentService › processRefund › should handle idempotent refund
    TypeError: Cannot read properties of undefined (reading 'customerId')
    at Object.processRefund (src/services/payment.ts:127:32)
  Tests: 3 failed, 287 passed

Recent commits:
  abc1234 - feat: add refund idempotency key validation
  def5678 - refactor: extract payment gateway client`,
  },
  {
    id: 'db',
    title: 'Postgres query slow',
    tag: 'db',
    sub: 'Database · production RDS',
    prompt: `DB is killing our API latency. RCA needed:

DB: PostgreSQL 15.2 (RDS db.r6g.xlarge)
p99 latency: 8s (was 200ms, last 2 hours)

Slow query:
  SELECT u.*, o.*, oi.* FROM users u
    JOIN orders o ON u.id=o.user_id
    JOIN order_items oi ON o.id=oi.order_id
  WHERE u.created_at > NOW()-INTERVAL '30 days'
  Duration: 12847ms · Rows: 4,200,000 examined, 8,432 returned

EXPLAIN: Seq Scan on order_items
No index on order_items.order_id
Table bloat: 68% dead tuples · Active connections: 98/100`,
  },
  {
    id: 'mem',
    title: 'Node.js memory leak',
    tag: 'mem',
    sub: 'Runtime · notification-worker',
    prompt: `Memory leak in production, crashes every ~8h:

Service: notification-worker  Runtime: Node.js 20.x
Pattern: +50MB/hour

Heap diff (2h):
  EventEmitter instances: +12,400
  Timeout objects: +8,900

Suspected code:
const processNotification = async (job) => {
  const emitter = new EventEmitter();
  emitter.on('retry', () => processNotification(job));
  await sendEmail(job.data);
  // never cleaned up
};
worker.on('message', processNotification); // 400x/min

Find root cause and show fixed code.`,
  },
]

export const CHIPS = [
  'Analyze OOMKilled pod',
  'Why is p99 spiking?',
  'Explain this stack trace',
  'Fix failing tests',
  'Debug slow queries',
  'Find the memory leak',
]
