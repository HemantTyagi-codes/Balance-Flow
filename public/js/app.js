const tokenKey = 'phonepe_token';

function setMessage(elementId, message, isError = false) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = message;
  el.style.color = isError ? '#dc2626' : '#673de6';
}

function saveToken(token) {
  if (token) {
    localStorage.setItem(tokenKey, token);
    document.cookie = `token=${token}; path=/; max-age=86400`;
  }
}

function getToken() {
  return localStorage.getItem(tokenKey);
}

function clearSession() {
  localStorage.removeItem(tokenKey);
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

async function apiRequest(url, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const response = await fetch(url, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) }
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

if (document.getElementById('login-form')) {
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    try {
      const data = await apiRequest('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) });
      saveToken(data.token);
      setMessage('login-message', 'Login successful! Redirecting...');
      setTimeout(() => window.location.href = '/dashboard', 800);
    } catch (error) {
      setMessage('login-message', error.message, true);
    }
  });
}

if (document.getElementById('register-form')) {
  document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    try {
      const data = await apiRequest('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) });
      saveToken(data.token);
      setMessage('register-message', 'Registration successful! Redirecting...');
      setTimeout(() => window.location.href = '/dashboard', 800);
    } catch (error) {
      setMessage('register-message', error.message, true);
    }
  });
}

if (document.getElementById('add-money-form')) {
  document.getElementById('add-money-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());
    payload.amount = Number(payload.amount);

    try {
      const data = await apiRequest('/api/wallet/add-money', { method: 'POST', body: JSON.stringify(payload) });
      setMessage('add-money-message', 'Money added successfully');
      document.getElementById('balance-value').textContent = `₹ ${data.balance}`;
      e.target.reset();
    } catch (error) {
      setMessage('add-money-message', error.message, true);
    }
  });
}

if (document.getElementById('pay-bill-form')) {
  document.getElementById('pay-bill-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());
    payload.amount = Number(payload.amount);

    try {
      const data = await apiRequest('/api/wallet/pay-bill', { method: 'POST', body: JSON.stringify(payload) });
      setMessage('pay-bill-message', 'Bill paid successfully');
      document.getElementById('balance-value').textContent = `₹ ${data.balance}`;
      e.target.reset();
    } catch (error) {
      setMessage('pay-bill-message', error.message, true);
    }
  });
}

if (document.querySelector('.logout-link')) {
  document.querySelector('.logout-link').addEventListener('click', (e) => {
    e.preventDefault();
    clearSession();
    window.location.href = '/login';
  });
}

if (window.location.pathname === '/dashboard') {
  (async function loadDashboard() {
    try {
      const data = await apiRequest('/api/auth/profile');
      if (document.getElementById('balance-value')) {
        document.getElementById('balance-value').textContent = `₹ ${data.balance || 0}`;
      }
    } catch (error) {
      window.location.href = '/login';
    }
  })();
}
