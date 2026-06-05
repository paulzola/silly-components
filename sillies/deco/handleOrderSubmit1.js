
async function handleOrderSubmit(formData) {
  if (!formData.email || !/^[^@]+@[^@]+$/.test(formData.email)) return { error: 'email' };
  if (!formData.items || formData.items.length === 0) return { error: 'items' };
  let total = 0;
  for (const item of formData.items) {
    const price = item.price * item.qty;
    const discount = item.qty > 10 ? price * 0.1 : 0;
    total += price - discount;
  }
  if (formData.promo) {
    const res = await fetch(`/api/promo/${formData.promo}`);
    const promo = await res.json();
    if (promo.valid) total = total * (1 - promo.discount);
  }
  const res = await fetch('/api/orders', { method: 'POST', body: JSON.stringify({ ...formData, total }) });
  // ...
}
