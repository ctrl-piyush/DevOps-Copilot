import { useState } from 'react'
import { supabase } from '../lib/supabase'
import styles from './Auth.module.css'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setError('')
    const fn = isSignUp
      ? supabase.auth.signUp
      : supabase.auth.signInWithPassword

    const { error } = await fn.call(supabase.auth, { email, password })
    if (error) setError(error.message)
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.box}>
        <h1 className={styles.title}>DevOps Copilot</h1>
        <p className={styles.sub}>{isSignUp ? 'Create an account' : 'Sign in to continue'}</p>
        <input
          className={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button className={styles.btn} onClick={handleSubmit}>
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
        <p className={styles.toggle} onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </p>
      </div>
    </div>
  )
}