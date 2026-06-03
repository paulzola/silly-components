import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export function CheckoutPage() {
  const dispatch = useDispatch();
  const cart = useSelector(s => s.cart);
  const user = useSelector(s => s.user);
  const [promo, setPromo] = useState('');
  const [promoData, setPromoData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (promo.length >= 4) {
      fetch(`/api/promo/${promo}`)
        .then(r => r.json())
        .then(data => {
          if (data.valid && new Date(data.expiresAt) > new Date()) {
            setPromoData(data);
          } else {
            setPromoData(null);
          }
        });
    }
  }, [promo]);

  let total = 0;
  for (const item of cart.items) {
    const price = item.price * item.qty;
    const discount = item.qty >= 10 ? price * 0.1 : 0;
    total += price - discount;
  }
  if (promoData) {
    total = total * (1 - promoData.discount);
  }
  if (user.isVip) {
    total = total * 0.95;
  }

  const handleSubmit = async () => {
    setError('');
    if (!user.email) { setError('Укажите email'); return; }
    if (cart.items.length === 0) { setError('Корзина пуста'); return; }
    if (total > 10000 && !user.verified) {
      setError('Для заказов от 10000 нужна верификация');
      return;
    }
    if (cart.items.some(i => i.restrictedCountries?.includes(user.country))) {
      setError('Некоторые товары недоступны в вашей стране');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          items: cart.items,
          total,
          promo: promoData?.code,
          userId: user.id,
        }),
      });
      if (!res.ok) throw new Error('Ошибка сервера');
      const order = await res.json();
      dispatch({ type: 'ORDER_CREATED', payload: order });
      window.location.href = `/orders/${order.id}`;
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Оформление заказа</h1>
      {cart.items.map(item => (
        <div key={item.id}>
          {item.name} × {item.qty} = {item.price * item.qty}₽
        </div>
      ))}
      <input
        value={promo}
        onChange={e => setPromo(e.target.value)}
        placeholder="Промокод"
      />
      {promoData && <div>Скидка {promoData.discount * 100}%</div>}
      <div>Итого: {total}₽</div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button disabled={loading} onClick={handleSubmit}>
        {loading ? 'Отправка...' : 'Оформить'}
      </button>
    </div>
  );
}
