export function createBrowserTokenStorage() {
  return {
    get: () => localStorage.getItem('token'),
    set: (token) => localStorage.setItem('token', token),
    clear: () => localStorage.removeItem('token'),
  };
}

export function createServerTokenStorage(cookies) {
  return {
    get: () => cookies.token ?? null,
    set: () => { /* устанавливается через response headers */ },
    clear: () => {},
  };
}