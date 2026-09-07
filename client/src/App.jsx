import { BrowserRouter, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { isLoggedIn, clearSession } from './utils/api';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';

function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}
function GuestRoute({ children }) {
  return isLoggedIn() ? <Navigate to="/dashboard" replace /> : children;
}

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const path = location.pathname;

  function handleLogout(e) {
    e.preventDefault();
    clearSession();
    navigate('/login');
  }

  return (
    <header className="site-header">
      <Link to={loggedIn ? '/dashboard' : '/'} className="brand">
        <div className="brand-mark">B</div>
        <div className="brand-text">
          <h1>Balance Flow</h1>
          <p>Smart Digital Wallet</p>
        </div>
      </Link>

      <nav className="nav-links">
        {loggedIn ? (
          <>
            <Link to="/dashboard"     className={path === '/dashboard'     ? 'active' : ''}>Dashboard</Link>
            <Link to="/transactions"  className={path === '/transactions'  ? 'active' : ''}>History</Link>
            <a href="#logout" className="nav-btn" onClick={handleLogout}>Logout</a>
          </>
        ) : (
          <>
            {path !== '/'         && <Link to="/">Home</Link>}
            {path !== '/login'    && <Link to="/login">Login</Link>}
            {path !== '/register' && <Link to="/register" className="nav-btn">Get Started</Link>}
          </>
        )}
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      © {new Date().getFullYear()} Balance Flow — Demo App · Built with React + Express
    </footer>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="shell">
        <Header />
        <Routes>
          <Route path="/"             element={<GuestRoute><Home /></GuestRoute>} />
          <Route path="/login"        element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register"     element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/dashboard"    element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
          <Route path="*"             element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
