import { useState, useEffect, useCallback } from 'react';

import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';

const todosApi = {
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

class TodoModel {
  constructor(initialTodos = []) {
    this.todos = initialTodos;
  }

  static validateText(text) {
    if (!text || !text.trim()) return { isValid: false, error: 'Text is required' };
    if (text.length > 100) return { isValid: false, error: 'Text too long' };
    return { isValid: true, error: null };
  }

  generateId() {
    return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  }

  addTempTodo(text) {
    const tempTodo = {
      id: this.generateId(),
      text: text.trim(),
      done: false,
      isTemp: true
    };
    this.todos = [tempTodo, ...this.todos];
    return tempTodo;
  }

  replaceTempTodo(tempId, realTodo) {
    this.todos = this.todos.map(t => t.id === tempId ? realTodo : t);
  }

  removeTempTodo(tempId) {
    this.todos = this.todos.filter(t => t.id !== tempId);
  }

  toggleTodo(id) {
    this.todos = this.todos.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    );
  }

  deleteTodo(id) {
    const deleted = this.todos.find(t => t.id === id);
    this.todos = this.todos.filter(t => t.id !== id);
    return deleted;
  }

  restoreTodo(todo) {
    this.todos = [...this.todos, todo];
  }

  setTodos(todos) {
    this.todos = todos;
  }

  getAllTodos() {
    return this.todos;
  }
}


const Status = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

export function useTodos() {
  const [model] = useState(() => new TodoModel());
  const [, forceUpdate] = useState({});

  const [status, setStatus] = useState(Status.LOADING);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const refresh = useCallback(() => forceUpdate({}), []);

  useEffect(() => {
    todosApi.fetchAll()
      .then(data => {
        model.setTodos(data);
        refresh();
        setStatus(Status.SUCCESS);
      })
      .catch(err => {
        setError(err.message);
        setStatus(Status.ERROR);
      });
  }, [model, refresh]);

  const addTodo = useCallback(async (text) => {
    const validation = TodoModel.validateText(text);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    const tempTodo = model.addTempTodo(text);
    refresh();
    setIsAdding(true);

    try {
      const saved = await todosApi.create({ text: text.trim(), done: false });
      model.replaceTempTodo(tempTodo.id, saved);
      refresh();
    } catch (err) {
      model.removeTempTodo(tempTodo.id);
      refresh();
      setError(err.message);
    } finally {
      setIsAdding(false);
    }
  }, [model, refresh]);

  const toggleTodo = useCallback(async (id) => {
    const originalTodos = [...model.getAllTodos()];
    model.toggleTodo(id);
    refresh();

    try {
      await todosApi.update(id, { done: !originalTodos.find(t => t.id === id)?.done });
    } catch (err) {
      model.setTodos(originalTodos);
      refresh();
      setError(err.message);
    }
  }, [model, refresh]);

  const deleteTodo = useCallback(async (id) => {
    const originalTodos = [...model.getAllTodos()];
    model.deleteTodo(id);
    refresh();

    try {
      await todosApi.delete(id);
    } catch (err) {
      model.setTodos(originalTodos);
      refresh();
      setError(err.message);
    }
  }, [model, refresh]);

  return {
    todos: model.getAllTodos(),
    status,
    error,
    isAdding,
    addTodo,
    toggleTodo,
    deleteTodo
  };
}



function LoadingState() {
  return <div className="loading">Loading todos...</div>;
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="error">
      <p>Error: {message}</p>
      <button onClick={onRetry} className="retry-btn">
        Try again
      </button>
    </div>
  );
}

function TodoForm({ onAdd, isAdding }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isAdding) return;
    onAdd(input);
    setInput('');
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        className="todo-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="What needs to be done?"
        disabled={isAdding}
      />
      <button className="add-btn" type="submit" disabled={isAdding}>
        {isAdding ? 'Adding...' : 'Add'}
      </button>
    </form>
  );
}

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div className="todo-item">
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
      />
      <span className={`todo-text ${todo.done ? 'completed' : ''}`}>
        {todo.text}
      </span>
      <button className="delete-btn" onClick={() => onDelete(todo.id)}>
        ×
      </button>
    </div>
  );
}

function TodoList({ todos, onToggle, onDelete }) {
  if (todos.length === 0) {
    return <div className="empty-state">✨ No todos yet. Add one!</div>;
  }

  return (
    <div className="todo-list">
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </div>
  );
}

export function TodoApp() {
  const { 
    todos, 
    status, 
    error, 
    isAdding, 
    addTodo, 
    toggleTodo, 
    deleteTodo 
  } = useTodos();

  if (status === Status.LOADING) return <LoadingState />;
  if (status === Status.ERROR) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="todo-app">
      <h1 className="title">📝 Todos</h1>
      <TodoForm onAdd={addTodo} isAdding={isAdding} />
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
    </div>
  );
}

