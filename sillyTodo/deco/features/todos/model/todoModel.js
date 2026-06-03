export class TodoModel {
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
