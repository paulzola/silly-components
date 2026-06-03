export const todosApi = {
  async fetchAll() {
    const res = await fetch('/api/todos');
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  },

  async create(todo) {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo)
    });
    if (!res.ok) throw new Error('Failed to create');
    return res.json();
  },

  async update(id, updates) {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
  },

  async delete(id) {
    const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete');
  }
};
