// Token helpers
const TOKEN_KEY = 'phonepe_token';

export function saveToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    document.cookie = `token=${token}; path=/; max-age=86400`;
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

export function isLoggedIn() {
  return Boolean(getToken());
}

export async function apiRequest(url, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}
