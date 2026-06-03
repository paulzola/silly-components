import { ValidationError } from '../domain/orderValidation';

export const errorMessages = {
  [ValidationError.EMAIL_REQUIRED]: 'Укажите email',
  [ValidationError.EMPTY_CART]: 'Корзина пуста',
  [ValidationError.VERIFICATION_REQUIRED]: 'Для крупных заказов нужна верификация',
  [ValidationError.COUNTRY_RESTRICTED]: 'Некоторые товары недоступны в вашей стране',
  NETWORK_ERROR: 'Ошибка соединения, попробуйте позже',
};

export function getErrorMessage(code) {
  return errorMessages[code] ?? 'Неизвестная ошибка';
}
