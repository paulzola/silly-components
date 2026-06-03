import React from 'react';

export function DiscountLine({ discount }) {
  return <div>Скидка {Math.round(discount * 100)}%</div>;
}
