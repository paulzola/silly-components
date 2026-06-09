async function loginUser(email, password) {
  const res = await fetch('/api/login', { ... });
  const token = (await res.json()).token;
  localStorage.setItem('token', token);
}


function createAuthService({ httpClient, tokenStorage }) {
  return {
    async login(email, password) {
      const { token } = await httpClient.post('/login', { email, password });
      tokenStorage.set(token);
    }
  };
}
