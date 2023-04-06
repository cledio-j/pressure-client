export function networkError(t: any, retryFn: () => void): ErrorObj {
  return {
    severity: 'fatal',
    active: true,
    title: t('messages.network_error_title'),
    message: t('messages.network_error_info'),
    details: '',
    options: [
      { name: 'cancel', func: () => {} },
      { name: 'retry', func: retryFn },
    ],
  }
}
export function invalidResponse(t: any, retryFn: () => void, res: Response): ErrorObj {
  return {
    severity: 'fatal',
    active: true,
    title: t('messages.invalid_response'),
    message: `${res.statusText} ${res.status}`,
    details: t('messages.invalid_response_details'),
    options: [
      { name: 'cancel', func: () => {} },
      { name: 'retry', func: retryFn },
    ],
  }
}
export function notAuthorized(t: any, retryFn: () => void, res?: Response): ErrorObj {
  return {
    severity: 'fatal',
    active: true,
    title: t('messages.unauthorized'),
    message: res ? `${res.statusText} ${res.status}` : '',
    details: t('messages.unauthorized_details'),
    options: [
      { name: 'cancel', func: () => {} },
      { name: 'retry', func: retryFn },
    ],
  }
}
