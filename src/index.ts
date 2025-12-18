/**
 * Optimizely Web Experimentation API Client
 * A TypeScript/JavaScript wrapper for the Optimizely REST API
 */

// Main client
export { OptimizelyClient } from './client';

// Types
export type {
  OptimizelyConfig,
  Project,
  Experiment,
  Variation,
  Audience,
  Page,
  Campaign,
  ListResponse,
  HttpMethod,
  RequestOptions,
  ApiErrorResponse,
} from './types';

// Error classes
export {
  OptimizelyError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  ServerError,
  NetworkError,
} from './errors';

// Resource classes (for advanced usage)
export { Projects } from './resources/projects';
export { Experiments } from './resources/experiments';
export { Audiences } from './resources/audiences';
export { Pages } from './resources/pages';
export { Campaigns } from './resources/campaigns';
