/** LoginPage — form only; calls App's onLogin which hits api.js */
import React, { useState } from 'react';

export default function LoginPage({ onLogin, onSwitchToRegister, loading }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ username, password });
  };

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <h2>Welcome back</h2>
        <p className="auth-tagline">Sign in to browse the menu and place orders</p>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="label">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="input-field"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-slate-500 mt-6 text-sm">
          New here?{' '}
          <button type="button" onClick={onSwitchToRegister} className="link-brand">
            Create an account
          </button>
        </p>
      </div>
    </section>
  );
}
