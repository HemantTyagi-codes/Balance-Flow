import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: '⚡',
    bg: 'rgba(124,90,245,0.15)',
    title: 'Instant Transfers',
    desc: 'Send money to any UPI ID in seconds — no delays, no hassle.',
  },
  {
    icon: '🧾',
    bg: 'rgba(6,214,160,0.15)',
    title: 'Pay Bills',
    desc: 'Settle electricity, internet, and any biller directly from your wallet.',
  },
  {
    icon: '📊',
    bg: 'rgba(255,209,102,0.15)',
    title: 'Track Spending',
    desc: 'Full transaction history with search and filter — always stay in control.',
  },
  {
    icon: '🔒',
    bg: 'rgba(255,77,109,0.15)',
    title: 'MPIN Security',
    desc: 'Every transaction protected by your personal 4-digit MPIN.',
  },
];

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-pill">
          <span>✦</span> Smart Digital Wallet
        </div>
        <h2>
          Money that moves<br />as fast as you do
        </h2>
        <p className="hero-sub">
          Balance Flow is your all-in-one wallet — send money instantly,
          pay any bill, and track every rupee, beautifully.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/register">
            Get Started — it's free
          </Link>
          <Link className="btn btn-outline" to="/login">
            Sign in
          </Link>
        </div>
      </section>

      {/* Stats */}
      <div className="hero-stats">
        {[
          { value: '10K+', label: 'Active Users' },
          { value: '₹2Cr+', label: 'Transferred' },
          { value: '99.9%', label: 'Uptime' },
          { value: '4.8★', label: 'User Rating' },
        ].map((s) => (
          <div className="stat-item" key={s.label}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="features-grid">
        {FEATURES.map((f) => (
          <div className="feature-card" key={f.title}>
            <div className="feature-icon" style={{ background: f.bg }}>
              {f.icon}
            </div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
