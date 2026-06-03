import React from 'react';
import { getErrorMessage } from '../../../i18n/errorMessages';

export function ErrorMessage({ code }) {
  return <div style={{ color: 'red' }}>{getErrorMessage(code)}</div>;
}
