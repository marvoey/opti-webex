/**
 * Main Optimizely Client
 */

import { OptimizelyConfig } from './types';
import { HttpClient } from './http-client';
import { Projects } from './resources/projects';
import { Experiments } from './resources/experiments';
import { Audiences } from './resources/audiences';
import { Pages } from './resources/pages';
import { Campaigns } from './resources/campaigns';

/**
 * Optimizely Web Experimentation API Client
 *
 * @example
 * ```typescript
 * const client = new OptimizelyClient({
 *   token: 'your_personal_access_token'
 * });
 *
 * // List all projects
 * const projects = await client.projects.list();
 *
 * // Get a specific project
 * const project = await client.projects.get('project_id');
 *
 * // List experiments for a project
 * const experiments = await client.experiments.list('project_id');
 * ```
 */
export class OptimizelyClient {
  private readonly httpClient: HttpClient;

  /** Projects API resource */
  public readonly projects: Projects;

  /** Experiments API resource */
  public readonly experiments: Experiments;

  /** Audiences API resource */
  public readonly audiences: Audiences;

  /** Pages API resource */
  public readonly pages: Pages;

  /** Campaigns API resource */
  public readonly campaigns: Campaigns;

  /**
   * Create a new Optimizely client
   * @param config - Client configuration
   */
  constructor(config: OptimizelyConfig) {
    this.httpClient = new HttpClient(config);

    // Initialize resource classes
    this.projects = new Projects(this.httpClient);
    this.experiments = new Experiments(this.httpClient);
    this.audiences = new Audiences(this.httpClient);
    this.pages = new Pages(this.httpClient);
    this.campaigns = new Campaigns(this.httpClient);
  }

  /**
   * Make a custom API request
   * Useful for endpoints not yet covered by the client
   * @param endpoint - API endpoint (e.g., '/projects')
   * @param options - Request options
   */
  async request<T = any>(
    endpoint: string,
    options?: {
      method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
      body?: any;
      params?: Record<string, string | number | boolean>;
    }
  ): Promise<T> {
    return this.httpClient.request<T>(endpoint, options);
  }
}
