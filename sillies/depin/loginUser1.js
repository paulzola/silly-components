async function loginUser(email, password) {
  const res = await fetch('/api/login', { ... });
  const token = (await res.json()).token;
  localStorage.setItem('token', token);
}