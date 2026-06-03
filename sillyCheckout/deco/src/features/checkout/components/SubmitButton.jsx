import React from 'react';

export function SubmitButton({ loading, onClick }) {
  return (
    <button disabled={loading} onClick={onClick}>
      {loading ? 'Отправка...' : 'Оформить'}
    </button>
  );
}
