// lib/auth/client.js
// Simple client-side auth helpers

// --- Cookie helpers ---
function getCookie(name) {
  if (typeof window === 'undefined') return null;
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='))
    ?.split('=')[1] || null;
}

function setCookie(name, value, days = 7) {
  if (typeof window === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; secure; samesite=strict`;
}

function removeCookie(name) {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// --- Auth state ---
export const getAuthToken = () => getCookie('auth-token');
export const isAuthenticated = () => !!getAuthToken();
export const requireAuth = (redirect = '/login') => {
  if (!isAuthenticated() && typeof window !== 'undefined') {
    window.location.href = redirect;
    return false;
  }
  return true;
};

// --- API calls ---
export async function checkAuthWithServer() {
  try {
    const res = await fetch('/api/auth/me', { credentials: 'include', cache: 'no-store' });
    const data = await res.json();
    return { success: res.ok, user: data.user || null, authenticated: !!data.user };
  } catch {
    return { success: false, user: null, authenticated: false };
  }
}

export async function loginViaAPI(email) {
  return sendAuthRequest('/api/auth/login', { email });
}

export async function registerViaAPI(userData) {
  return sendAuthRequest('/api/auth/register', userData);
}

export async function logoutViaAPI() {
  try {
    const res = await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    removeCookie('auth-token');
    return { success: res.ok };
  } catch {
    removeCookie('auth-token');
    return { success: false };
  }
}

// --- Helper for login/register ---
async function sendAuthRequest(url, body) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body)
    });
    const data = await res.json();
    return res.ok ? { success: true, user: data.user } : { success: false, error: data.error };
  } catch {
    return { success: false, error: 'Network error' };
  }
}

// --- Auth events ---
export function onAuthStateChange(callback) {
  if (typeof window === 'undefined') return;
  const handler = () => callback(isAuthenticated());
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}

export function dispatchAuthStateChange(authenticated) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new StorageEvent('storage', { key: 'auth-token', newValue: authenticated ? '1' : '' }));
}
