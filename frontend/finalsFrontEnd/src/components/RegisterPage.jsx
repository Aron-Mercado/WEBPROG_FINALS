/** RegisterPage — new customer account; always creates role customer on backend */
import React, { useState } from 'react';

export default function RegisterPage({ onRegister, onSwitchToLogin, loading }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister({ username, password });
  };

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <h2>Create account</h2>
        <p className="auth-tagline">Join as a customer and start ordering</p>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="label">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="input-field"
              placeholder="Choose a username"
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
              placeholder="Choose a password"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary-full">
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="text-center text-slate-500 mt-6 text-sm">
          Already have an account?{' '}
          <button type="button" onClick={onSwitchToLogin} className="link-brand">
            Sign in
          </button>
        </p>
      </div>
    </section>
  );
}
