const TOKEN_KEY = 'token';

export const getAuthToken = () => {
  const fromStorage = localStorage.getItem(TOKEN_KEY);
  if (fromStorage) return fromStorage;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${TOKEN_KEY}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

export const isAuthenticated = () => Boolean(getAuthToken());

export const setAuthToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `${TOKEN_KEY}=${token}; path=/; sameSite=Lax`;
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
};
