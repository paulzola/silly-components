import { useState, useEffect, useCallback } from 'react';
import { todosApi } from '../api/todosApi';
import { TodoModel } from '../model/todoModel';

const Status = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

const ActionStatus = {
  IDLE: 'idle',
  PENDING: 'pending',
  SUCCESS: 'success',
  ERROR: 'error'
};

export function useTodos() {
  const [model] = useState(() => new TodoModel());
  const [, forceUpdate] = useState({});

  const [status, setStatus] = useState(Status.LOADING);
  const [actionStatus, setActionStatus] = useState(ActionStatus.IDLE);
  const [error, setError] = useState(null);

  const refresh = useCallback(() => forceUpdate({}), []);

  useEffect(() => {
    setStatus(Status.LOADING);
    
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
    setActionStatus(ActionStatus.PENDING);

    try {
      const saved = await todosApi.create({ text: text.trim(), done: false });
      model.replaceTempTodo(tempTodo.id, saved);
      refresh();
      setActionStatus(ActionStatus.SUCCESS);
    } catch (err) {
      model.removeTempTodo(tempTodo.id);
      refresh();
      setError(err.message);
      setActionStatus(ActionStatus.ERROR);
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
    isAdding: actionStatus === ActionStatus.PENDING,
    setFilter,
    addTodo,
    toggleTodo,
    deleteTodo
  };
}
