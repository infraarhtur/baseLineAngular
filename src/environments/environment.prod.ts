export const environment = {
  production: true,
  apiUrl: 'http://localhost:8001/',
  apiUrlAuth: 'http://localhost:8002/api/v1/',

  // Token refresh configuration
  tokenRefreshIntervalMinutes: 5, // Verificar cada 5 minutos
  tokenWarningMinutesBeforeExpiry: 10, // Avisar 10 minutos antes de expirar
  autoRefreshEnabled: true, // Habilitar refresh automático

  // Token endpoints
  tokenEndpoints: {
    login: 'auth/login',
    refresh: 'auth/refresh-token',
    logout: 'auth/logout',
    validate: 'auth/validate'
  },

  // Token settings
  tokenSettings: {
    maxRetryAttempts: 3, // Máximo número de intentos de refresh
    retryDelayMs: 1000, // Delay entre reintentos en ms
    logoutOnRefreshFailure: true, // Logout automático si falla el refresh
    showRefreshNotifications: true // Mostrar notificaciones de refresh
  }
};
