export function createCheckoutService({ httpClient }) {
  return {
    async fetchPromo(code) {
      try {
        const data = await httpClient.get(`/promo/${code}`);
        if (!data.valid) return null;
        if (new Date(data.expiresAt) <= new Date()) return null;
        return data;
      } catch {
        return null;
      }
    },

    async submitOrder(order) {
      return httpClient.post('/orders', order);
    },
  };
}
