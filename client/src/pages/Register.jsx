import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiRequest, saveToken } from '../utils/api';

const FIELDS = [
  { id: 'reg-name',     label: 'Full Name',      name: 'name',     type: 'text',     placeholder: 'Hemant Tyagi',          autoComplete: 'name' },
  { id: 'reg-email',    label: 'Email',           name: 'email',    type: 'email',    placeholder: 'you@example.com',       autoComplete: 'email' },
  { id: 'reg-phone',    label: 'Phone',           name: 'phone',    type: 'text',     placeholder: '9876543210',            autoComplete: 'tel' },
  { id: 'reg-password', label: 'Password',        name: 'password', type: 'password', placeholder: '8+ characters',        autoComplete: 'new-password' },
  { id: 'reg-mpin',     label: 'MPIN (4 digits)', name: 'mpin',     type: 'password', placeholder: '••••',                 autoComplete: 'off', maxLength: 4, pattern: '\\d{4}' },
];

export default function Register() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState({ text: '', isError: false });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', isError: false });
    const payload = Object.fromEntries(new FormData(e.target).entries());
    try {
      const data = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      saveToken(data.token);
      setMsg({ text: 'Account created! Redirecting…', isError: false });
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
        <div className="auth-icon">🚀</div>
        <h2>Create Account</h2>
        <p>Join Balance Flow today — it&apos;s free</p>

        <form id="register-form" className="form-stack" onSubmit={handleSubmit}>
          {FIELDS.map((f) => (
            <div className="form-group" key={f.id}>
              <label className="form-label" htmlFor={f.id}>{f.label}</label>
              <input
                id={f.id}
                className="form-input"
                type={f.type}
                name={f.name}
                placeholder={f.placeholder}
                autoComplete={f.autoComplete}
                maxLength={f.maxLength}
                pattern={f.pattern}
                required
              />
            </div>
          ))}

          {msg.text && (
            <div className={`message-box ${msg.isError ? 'error' : 'success'}`}>
              {msg.isError ? '⚠️' : '✅'} {msg.text}
            </div>
          )}

          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account →'}
          </button>
        </form>

        <p className="auth-divider">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
