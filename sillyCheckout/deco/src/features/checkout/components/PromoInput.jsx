import React from 'react';

export function PromoInput({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Промокод"
    />
  );
}