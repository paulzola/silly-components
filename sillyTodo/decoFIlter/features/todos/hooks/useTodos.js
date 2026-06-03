import { useState, useEffect, useCallback } from 'react';
import { todosApi } from '../api/todosApi';
import { TodoModel } from '../model/todoModel';
import { Status } from './status';
 
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

  const setFilter = useCallback((filter) => {
    model.setFilter(filter);
    refresh();
  }, [model, refresh]);

  return {
    todos: model.getFilteredTodos(),
    filter: model.getFilter(),
    status,
    error,
    isAdding,
    setFilter,
    addTodo,
    toggleTodo,
    deleteTodo
  };
}
