import React, { useState, useEffect } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/todos')
      .then(res => res.json())
      .then(data => {
        setTodos(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const addTodo = () => {
    if (!input.trim()) return;
    
    const newTodo = { id: Date.now(), text: input, done: false };
    setTodos([newTodo, ...todos]);
    setInput('');
    setSaving(true);
    
    fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo)
    })
      .then(res => res.json())
      .then(saved => {
        setTodos(prev => prev.map(t => t.id === newTodo.id ? saved : t));
        setSaving(false);
      })
      .catch(() => {
        setTodos(prev => prev.filter(t => t.id !== newTodo.id));
        setError('Failed to add');
        setSaving(false);
      });
  };

  const toggleTodo = (id) => {
    const todo = todos.find(t => t.id === id);
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    
    fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !todo.done })
    }).catch(() => {
      setTodos(prev => prev.map(t => t.id === id ? todo : t));
      setError('Failed to update');
    });
  };

  const deleteTodo = (id) => {
    const todo = todos.find(t => t.id === id);
    setTodos(prev => prev.filter(t => t.id !== id));
    
    fetch(`/api/todos/${id}`, { method: 'DELETE' })
      .catch(() => {
        setTodos(prev => [...prev, todo]);
        setError('Failed to delete');
      });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="todo-app">
      <h1>📝 Todos</h1>
      
      <div className="todo-form">
        <input
          className="todo-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="What needs to be done?"
          disabled={saving}
        />
        <button className="add-btn" onClick={addTodo} disabled={saving}>
          {saving ? 'Adding...' : 'Add'}
        </button>
      </div>
      
      <div className="todo-list">
        {todos.map(todo => (
          <div key={todo.id} className="todo-item">
            <input
              type="checkbox"
              className="todo-checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
            />
            <span className={`todo-text ${todo.done ? 'completed' : ''}`}>
              {todo.text}
            </span>
            <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
              ×
            </button>
          </div>
        ))}
      </div>
      
      {todos.length === 0 && (
        <div className="empty-state">✨ No todos yet. Add one!</div>
      )}
    </div>
  );
}

export default TodoApp;
