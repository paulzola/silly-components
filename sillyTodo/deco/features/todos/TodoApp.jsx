import { useTodos } from './hooks/useTodos';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';

const Status = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

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

