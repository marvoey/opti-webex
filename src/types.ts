/**
 * Optimizely Web Experimentation API Types
 */

/**
 * Configuration options for the Optimizely client
 */
export interface OptimizelyConfig {
  /** Personal access token for authentication */
  token: string;
  /** Base URL for the API (defaults to https://api.optimizely.com/v2) */
  baseUrl?: string;
  /** Request timeout in milliseconds (defaults to 30000) */
  timeout?: number;
}

/**
 * Base response structure for list endpoints
 */
export interface ListResponse<T> {
  data?: T[];
  [key: string]: any;
}

/**
 * Project resource
 */
export interface Project {
  id: string;
  account_id: string;
  name: string;
  platform: string;
  status: 'active' | 'archived';
  web_snippet?: {
    code_revision?: number;
    js_file_size?: number;
    project_javascript?: string;
  };
  created?: string;
  last_modified?: string;
}

/**
 * Experiment resource
 */
export interface Experiment {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  status: 'not_started' | 'running' | 'paused' | 'archived';
  type: 'a/b' | 'multivariate' | 'multi-armed_bandit';
  created?: string;
  last_modified?: string;
}

/**
 * Variation resource
 */
export interface Variation {
  id: string;
  experiment_id: string;
  name: string;
  weight?: number;
  is_baseline?: boolean;
  actions?: any[];
}

/**
 * Audience resource
 */
export interface Audience {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  conditions?: string;
  created?: string;
  last_modified?: string;
}

/**
 * Page resource
 */
export interface Page {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  edit_url?: string;
  page_type?: string;
  category?: string;
  conditions?: any;
  created?: string;
  last_modified?: string;
  archived?: boolean;
}

/**
 * HTTP method types
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Request options for API calls
 */
export interface RequestOptions {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
}

/**
 * Error response from the API
 */
export interface ApiErrorResponse {
  message?: string;
  error?: string;
  code?: string;
  status?: number;
}
