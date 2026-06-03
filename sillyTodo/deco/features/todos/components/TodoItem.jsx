export function TodoItem({ todo, onToggle, onDelete }) {
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
