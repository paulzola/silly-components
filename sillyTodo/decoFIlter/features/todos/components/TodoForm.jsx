import { useState } from 'react';

export function TodoForm({ onAdd, isAdding }) {
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
