import React from 'react';

export function CartItemsList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.name} × {item.qty} = {item.price * item.qty}₽
        </li>
      ))}
    </ul>
  );
}
