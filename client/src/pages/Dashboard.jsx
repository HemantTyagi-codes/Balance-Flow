import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiRequest, clearSession } from '../utils/api';

function PanelCard({ icon, iconBg, title, children }) {
  return (
    <div className="panel-card">
      <h3>
        <span className="panel-icon" style={{ background: iconBg }}>{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  );
}

function MessageBox({ msg }) {
  if (!msg.text) return null;
  return (
    <div className={`message-box ${msg.isError ? 'error' : 'success'}`} style={{ marginTop: '0.75rem' }}>
      {msg.isError ? '⚠️' : '✅'} {msg.text}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser]         = useState(null);
  const [balance, setBalance]   = useState(0);
  const [addMsg, setAddMsg]     = useState({ text: '', isError: false });
  const [payMsg, setPayMsg]     = useState({ text: '', isError: false });
  const [sendMsg, setSendMsg]   = useState({ text: '', isError: false });
  const [addLoading, setAddLoading]   = useState(false);
  const [payLoading, setPayLoading]   = useState(false);
  const [sendLoading, setSendLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiRequest('/api/auth/profile');
        setUser(data);
        setBalance(data.balance ?? 0);
      } catch {
        navigate('/login');
      }
    })();
  }, [navigate]);

  async function handleAddMoney(e) {
    e.preventDefault();
    setAddLoading(true);
    setAddMsg({ text: '', isError: false });
    const payload = Object.fromEntries(new FormData(e.target).entries());
    payload.amount = Number(payload.amount);
    try {
      const data = await apiRequest('/api/wallet/add-money', { method: 'POST', body: JSON.stringify(payload) });
      setBalance(data.balance);
      setAddMsg({ text: `₹${payload.amount} added successfully!`, isError: false });
      e.target.reset();
    } catch (err) {
      setAddMsg({ text: err.message, isError: true });
    } finally {
      setAddLoading(false);
    }
  }

  async function handlePayBill(e) {
    e.preventDefault();
    setPayLoading(true);
    setPayMsg({ text: '', isError: false });
    const payload = Object.fromEntries(new FormData(e.target).entries());
    payload.amount = Number(payload.amount);
    try {
      const data = await apiRequest('/api/wallet/pay-bill', { method: 'POST', body: JSON.stringify(payload) });
      setBalance(data.balance);
      setPayMsg({ text: 'Bill paid successfully!', isError: false });
      e.target.reset();
    } catch (err) {
      setPayMsg({ text: err.message, isError: true });
    } finally {
      setPayLoading(false);
    }
  }

  async function handleSendMoney(e) {
    e.preventDefault();
    setSendLoading(true);
    setSendMsg({ text: '', isError: false });
    const payload = Object.fromEntries(new FormData(e.target).entries());
    payload.amount = Number(payload.amount);
    try {
      const data = await apiRequest('/api/transactions/send', { method: 'POST', body: JSON.stringify(payload) });
      // re-fetch balance since send doesn't return it directly
      const profile = await apiRequest('/api/auth/profile');
      setBalance(profile.balance ?? balance);
      setSendMsg({ text: `₹${payload.amount} sent successfully!`, isError: false });
      e.target.reset();
    } catch (err) {
      setSendMsg({ text: err.message, isError: true });
    } finally {
      setSendLoading(false);
    }
  }

  function handleLogout() {
    clearSession();
    navigate('/login');
  }

  return (
    <main className="dashboard-page">
      {/* Balance Hero */}
      <div className="balance-hero">
        <div className="balance-info">
          <p className="eyebrow">Your Balance</p>
          <h2>Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! 👋</h2>
          <div className="balance-amount">
            <span className="currency">₹</span>
            {Number(balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          {user?.upiId && (
            <div className="balance-upi">
              🔑 {user.upiId}
            </div>
          )}
        </div>
        <div className="balance-actions">
          <Link to="/transactions" className="balance-action-btn">
            📋 History
          </Link>
          <button className="balance-action-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Action Panels */}
      <div className="dashboard-grid">
        {/* Add Money */}
        <PanelCard icon="💰" iconBg="rgba(6,214,160,0.15)" title="Add Money">
          <form id="add-money-form" className="form-stack" onSubmit={handleAddMoney}>
            <div className="form-group">
              <label className="form-label" htmlFor="add-amount">Amount (₹)</label>
              <input id="add-amount" className="form-input" type="number" name="amount" min="1" placeholder="500" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="add-mpin">MPIN</label>
              <input id="add-mpin" className="form-input" type="password" name="mpin" maxLength="4" placeholder="••••" required />
            </div>
            <button className="btn btn-primary btn-full" type="submit" disabled={addLoading}>
              {addLoading ? 'Adding…' : '+ Add Money'}
            </button>
            <MessageBox msg={addMsg} />
          </form>
        </PanelCard>

        {/* Pay Bill */}
        <PanelCard icon="🧾" iconBg="rgba(255,209,102,0.15)" title="Pay Bill">
          <form id="pay-bill-form" className="form-stack" onSubmit={handlePayBill}>
            <div className="form-group">
              <label className="form-label" htmlFor="biller-name">Biller Name</label>
              <input id="biller-name" className="form-input" type="text" name="billerName" placeholder="Electricity Board" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="bill-amount">Amount (₹)</label>
              <input id="bill-amount" className="form-input" type="number" name="amount" min="1" placeholder="1200" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="bill-mpin">MPIN</label>
              <input id="bill-mpin" className="form-input" type="password" name="mpin" maxLength="4" placeholder="••••" required />
            </div>
            <button className="btn btn-primary btn-full" type="submit" disabled={payLoading}>
              {payLoading ? 'Paying…' : 'Pay Bill'}
            </button>
            <MessageBox msg={payMsg} />
          </form>
        </PanelCard>

        {/* Send Money */}
        <PanelCard icon="✈️" iconBg="rgba(124,90,245,0.15)" title="Send Money">
          <form id="send-money-form" className="form-stack" onSubmit={handleSendMoney}>
            <div className="form-group">
              <label className="form-label" htmlFor="receiver-upi">Receiver UPI ID</label>
              <input id="receiver-upi" className="form-input" type="text" name="receiverUpiId" placeholder="name@phonepe" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="send-amount">Amount (₹)</label>
              <input id="send-amount" className="form-input" type="number" name="amount" min="1" placeholder="250" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="send-mpin">MPIN</label>
              <input id="send-mpin" className="form-input" type="password" name="mpin" maxLength="4" placeholder="••••" required />
            </div>
            <button className="btn btn-primary btn-full" type="submit" disabled={sendLoading}>
              {sendLoading ? 'Sending…' : 'Send Money ✈️'}
            </button>
            <MessageBox msg={sendMsg} />
          </form>
        </PanelCard>

        {/* Quick Links */}
        <PanelCard icon="🔗" iconBg="rgba(255,77,109,0.15)" title="Quick Access">
          <div className="form-stack">
            <Link to="/transactions" className="btn btn-outline btn-full" style={{ justifyContent: 'flex-start', gap: '0.75rem' }}>
              📋 <span>Transaction History</span>
            </Link>
            <div className="btn btn-ghost btn-full" style={{ justifyContent: 'flex-start', gap: '0.75rem', fontSize: '0.88rem', borderRadius: '999px' }}>
              🔑 <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.upiId ?? 'Loading UPI ID…'}
              </span>
            </div>
            <button className="btn btn-danger btn-full" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </PanelCard>
      </div>
    </main>
  );
}
