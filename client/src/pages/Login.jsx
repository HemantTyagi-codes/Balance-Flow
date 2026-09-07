import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiRequest, saveToken } from '../utils/api';

export default function Login() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState({ text: '', isError: false });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', isError: false });
    const payload = Object.fromEntries(new FormData(e.target).entries());
    try {
      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      saveToken(data.token);
      setMsg({ text: 'Login successful! Redirecting…', isError: false });
      setTimeout(() => navigate('/dashboard'), 700);
    } catch (err) {
      setMsg({ text: err.message, isError: true });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-icon">💳</div>
        <h2>Welcome back</h2>
        <p>Sign in to your Balance Flow account</p>

        <form id="login-form" className="form-stack" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email</label>
            <input
              id="login-email"
              className="form-input"
              type="email"
              name="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              className="form-input"
              type="password"
              name="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {msg.text && (
            <div className={`message-box ${msg.isError ? 'error' : 'success'}`}>
              {msg.isError ? '⚠️' : '✅'} {msg.text}
            </div>
          )}

          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in →'}
          </button>
        </form>

        <p className="auth-divider">
          Don&apos;t have an account?{' '}
          <Link to="/register">Create one</Link>
        </p>
      </div>
    </main>
  );
}
