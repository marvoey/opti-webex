/**
 * Error classes for Optimizely API
 */

import { ApiErrorResponse } from './types';

/**
 * Base error class for all Optimizely API errors
 */
export class OptimizelyError extends Error {
  public readonly status?: number;
  public readonly code?: string;
  public readonly details?: any;

  constructor(message: string, options?: { status?: number; code?: string; details?: any }) {
    super(message);
    this.name = 'OptimizelyError';
    this.status = options?.status;
    this.code = options?.code;
    this.details = options?.details;

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OptimizelyError);
    }
  }
}

/**
 * Authentication error (401)
 */
export class AuthenticationError extends OptimizelyError {
  constructor(message: string = 'Authentication failed', details?: any) {
    super(message, { status: 401, code: 'AUTHENTICATION_ERROR', details });
    this.name = 'AuthenticationError';
  }
}

/**
 * Authorization error (403)
 */
export class AuthorizationError extends OptimizelyError {
  constructor(message: string = 'Not authorized to access this resource', details?: any) {
    super(message, { status: 403, code: 'AUTHORIZATION_ERROR', details });
    this.name = 'AuthorizationError';
  }
}

/**
 * Resource not found error (404)
 */
export class NotFoundError extends OptimizelyError {
  constructor(message: string = 'Resource not found', details?: any) {
    super(message, { status: 404, code: 'NOT_FOUND', details });
    this.name = 'NotFoundError';
  }
}

/**
 * Validation error (400)
 */
export class ValidationError extends OptimizelyError {
  constructor(message: string = 'Validation failed', details?: any) {
    super(message, { status: 400, code: 'VALIDATION_ERROR', details });
    this.name = 'ValidationError';
  }
}

/**
 * Rate limit error (429)
 */
export class RateLimitError extends OptimizelyError {
  constructor(message: string = 'Rate limit exceeded', details?: any) {
    super(message, { status: 429, code: 'RATE_LIMIT_ERROR', details });
    this.name = 'RateLimitError';
  }
}

/**
 * Server error (500+)
 */
export class ServerError extends OptimizelyError {
  constructor(message: string = 'Server error occurred', status?: number, details?: any) {
    super(message, { status, code: 'SERVER_ERROR', details });
    this.name = 'ServerError';
  }
}

/**
 * Network/timeout error
 */
export class NetworkError extends OptimizelyError {
  constructor(message: string = 'Network request failed', details?: any) {
    super(message, { code: 'NETWORK_ERROR', details });
    this.name = 'NetworkError';
  }
}

/**
 * Factory function to create appropriate error from API response
 */
export function createErrorFromResponse(
  status: number,
  data: ApiErrorResponse | string,
  endpoint: string
): OptimizelyError {
  const errorMessage = typeof data === 'string' ? data : (data.message || data.error || 'API request failed');
  const details = { endpoint, status, response: data };

  switch (status) {
    case 400:
      return new ValidationError(errorMessage, details);
    case 401:
      return new AuthenticationError(errorMessage, details);
    case 403:
      return new AuthorizationError(errorMessage, details);
    case 404:
      return new NotFoundError(errorMessage, details);
    case 429:
      return new RateLimitError(errorMessage, details);
    case 500:
    case 502:
    case 503:
    case 504:
      return new ServerError(errorMessage, status, details);
    default:
      return new OptimizelyError(errorMessage, { status, code: 'API_ERROR', details });
  }
}
