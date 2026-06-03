export function createHttpClient({ baseUrl, getAuthToken }) {
  async function request(path, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    const token = getAuthToken?.();
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${baseUrl}${path}`, { ...options, headers });
    if (!res.ok) {
      const error = new Error('HTTP_ERROR');
      error.status = res.status;
      throw error;
    }
    return res.json();
  }

  return {
    get: (path) => request(path, { method: 'GET' }),
    post: (path, body) => request(path, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  };
}