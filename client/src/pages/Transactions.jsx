import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest, getToken } from '../utils/api';

// ── Helpers ──────────────────────────────────────────────
const TYPE_META = {
  ADD_MONEY:    { icon: '💰', bg: 'rgba(6,214,160,0.15)',   label: 'Add Money' },
  BILL_PAYMENT: { icon: '🧾', bg: 'rgba(255,209,102,0.15)', label: 'Bill Payment' },
  TRANSFER:     { icon: '✈️', bg: 'rgba(124,90,245,0.15)',  label: 'Transfer' },
  RECHARGE:     { icon: '📱', bg: 'rgba(255,77,109,0.15)',  label: 'Recharge' },
  QR_PAYMENT:   { icon: '📷', bg: 'rgba(6,214,160,0.15)',   label: 'QR Payment' },
};

const DATE_FILTERS = [
  { label: 'All Time',   value: 'all' },
  { label: 'Today',      value: 'today' },
  { label: 'This Week',  value: 'week' },
  { label: 'This Month', value: 'month' },
];

const TYPE_FILTERS = [
  { label: 'All',          value: 'all' },
  { label: 'Add Money',    value: 'ADD_MONEY' },
  { label: 'Bill Payment', value: 'BILL_PAYMENT' },
  { label: 'Transfer',     value: 'TRANSFER' },
];

function isWithinRange(dateStr, range) {
  const date = new Date(dateStr);
  const now  = new Date();
  if (range === 'today') {
    return date.toDateString() === now.toDateString();
  }
  if (range === 'week') {
    const start = new Date(now);
    start.setDate(now.getDate() - 7);
    return date >= start;
  }
  if (range === 'month') {
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }
  return true; // 'all'
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function getTxnTitle(txn, myId) {
  if (txn.type === 'ADD_MONEY') return 'Added to Wallet';
  if (txn.type === 'BILL_PAYMENT') return txn.billerName ? `Bill — ${txn.billerName}` : 'Bill Payment';
  if (txn.type === 'TRANSFER') {
    const isDebit = txn.sender?._id === myId;
    return isDebit
      ? `Sent to ${txn.receiver?.name ?? txn.receiver?.upiId ?? 'User'}`
      : `Received from ${txn.sender?.name ?? txn.sender?.upiId ?? 'User'}`;
  }
  return TYPE_META[txn.type]?.label ?? txn.type;
}

function isCredit(txn, myId) {
  if (txn.type === 'ADD_MONEY') return true;
  if (txn.type === 'TRANSFER')  return txn.receiver?._id === myId;
  return false;
}

// ── Component ─────────────────────────────────────────────
export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [myId, setMyId]           = useState('');
  const [search, setSearch]       = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    (async () => {
      try {
        const [profile, txns] = await Promise.all([
          apiRequest('/api/auth/profile'),
          apiRequest('/api/transactions/history'),
        ]);
        setMyId(profile._id);
        setTransactions(txns.transactions ?? []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    return transactions.filter((txn) => {
      // type filter
      if (typeFilter !== 'all' && txn.type !== typeFilter) return false;
      // date filter
      if (!isWithinRange(txn.createdAt, dateFilter)) return false;
      // search
      if (search.trim()) {
        const q = search.toLowerCase();
        const title = getTxnTitle(txn, myId).toLowerCase();
        const biller = (txn.billerName ?? '').toLowerCase();
        const senderName = (txn.sender?.name ?? '').toLowerCase();
        const receiverName = (txn.receiver?.name ?? '').toLowerCase();
        if (
          !title.includes(q) &&
          !biller.includes(q) &&
          !senderName.includes(q) &&
          !receiverName.includes(q)
        ) return false;
      }
      return true;
    });
  }, [transactions, search, typeFilter, dateFilter, myId]);

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p className="eyebrow">Wallet</p>
          <h2>Transaction History</h2>
          <p style={{ color: 'var(--text-2)', marginTop: '0.3rem' }}>
            Every rupee, tracked and searchable
          </p>
        </div>
        <Link to="/dashboard" className="btn btn-outline btn-sm">
          ← Dashboard
        </Link>
      </div>

      {/* Controls */}
      <div className="txn-controls">
        {/* Search */}
        <div className="txn-search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="form-input txn-search"
            type="text"
            placeholder="Search by name, biller, UPI…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Date filter */}
        <select
          className="txn-select"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          {DATE_FILTERS.map((d) => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
      </div>

      {/* Type filter chips */}
      <div className="filter-group" style={{ marginBottom: '1rem' }}>
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.value}
            className={`filter-btn ${typeFilter === f.value ? 'active' : ''}`}
            onClick={() => setTypeFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* State: loading */}
      {loading && (
        <div className="spinner-wrap"><div className="spinner" /></div>
      )}

      {/* State: error */}
      {!loading && error && (
        <div className="message-box error">⚠️ {error}</div>
      )}

      {/* State: results */}
      {!loading && !error && (
        <>
          <p className="txn-count">
            Showing <strong>{filtered.length}</strong> of <strong>{transactions.length}</strong> transactions
          </p>

          {filtered.length === 0 ? (
            <div className="txn-empty">
              <div className="empty-icon">📭</div>
              <h3>No transactions found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="txn-list">
              {filtered.map((txn) => {
                const meta    = TYPE_META[txn.type] ?? { icon: '💸', bg: 'rgba(255,255,255,0.08)' };
                const credit  = isCredit(txn, myId);
                const title   = getTxnTitle(txn, myId);

                return (
                  <div className="txn-card" key={txn._id}>
                    <div className="txn-icon" style={{ background: meta.bg }}>
                      {meta.icon}
                    </div>
                    <div className="txn-body">
                      <div className="txn-title">{title}</div>
                      <div className="txn-sub">
                        <span className="badge badge-purple" style={{ marginRight: '0.4rem' }}>
                          {meta.label ?? txn.type}
                        </span>
                        <span className={`badge ${txn.status === 'SUCCESS' ? 'badge-success' : txn.status === 'FAILED' ? 'badge-danger' : 'badge-warning'}`}>
                          {txn.status}
                        </span>
                        {txn.note && <span style={{ marginLeft: '0.5rem', color: 'var(--text-3)' }}>{txn.note}</span>}
                      </div>
                    </div>
                    <div className="txn-right">
                      <div className={`txn-amount ${credit ? 'credit' : 'debit'}`}>
                        {credit ? '+' : '−'}₹{Number(txn.amount).toLocaleString('en-IN')}
                      </div>
                      <div className="txn-date">{formatDate(txn.createdAt)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
