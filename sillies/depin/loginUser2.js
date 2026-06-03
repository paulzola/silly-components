
function createAuthService({ httpClient, tokenStorage }) {
  return {
    async login(email, password) {
      const { token } = await httpClient.post('/login', { email, password });
      tokenStorage.set(token);
    }
  };
}