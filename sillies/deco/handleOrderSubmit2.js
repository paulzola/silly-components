
async function handleOrderSubmit(formData) {
  const validationError = validateOrder(formData);
  if (validationError) return { error: validationError };

  const total = await calculateTotal(formData.items, formData.promo);
  return submitOrder({ ...formData, total });
}