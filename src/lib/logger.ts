import * as Sentry from '@sentry/react-native';

export function logError(error: unknown, context?: string): void {
  if (__DEV__) console.error(`[${context ?? 'error'}]`, error);
  Sentry.captureException(error);
}
