/**
 * HTTP Client for making requests to Optimizely API
 */

import { OptimizelyConfig, RequestOptions } from './types';
import { createErrorFromResponse, NetworkError } from './errors';

export class HttpClient {
  private readonly token: string;
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor(config: OptimizelyConfig) {
    if (!config.token) {
      throw new Error('Optimizely token is required');
    }

    // Trim whitespace and remove any surrounding quotes
    const trimmedToken = config.token.trim().replace(/^["']|["']$/g, '');

    if (!trimmedToken) {
      throw new Error('Optimizely token cannot be empty');
    }

    // Basic validation for token format
    if (trimmedToken.includes(' ')) {
      throw new Error('Optimizely token contains invalid whitespace');
    }

    this.token = trimmedToken;
    this.baseUrl = config.baseUrl || 'https://api.optimizely.com/v2';
    this.timeout = config.timeout || 30000;
  }

  /**
   * Make an HTTP request to the Optimizely API
   */
  async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = this.buildUrl(endpoint, options.params);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers: this.buildHeaders(options.headers),
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      return await this.handleResponse<T>(response, endpoint);
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new NetworkError(`Request timeout after ${this.timeout}ms`, { endpoint, timeout: this.timeout });
        }
        if (error.message.includes('fetch')) {
          throw new NetworkError(`Network request failed: ${error.message}`, { endpoint, originalError: error });
        }
      }

      throw error;
    }
  }

  /**
   * Make a GET request
   */
  async get<T = any>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  /**
   * Make a POST request
   */
  async post<T = any>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body });
  }

  /**
   * Make a PUT request
   */
  async put<T = any>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body });
  }

  /**
   * Make a PATCH request
   */
  async patch<T = any>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body });
  }

  /**
   * Make a DELETE request
   */
  async delete<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * Build the full URL with query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = `${this.baseUrl}${endpoint}`;

    if (!params || Object.keys(params).length === 0) {
      return url;
    }

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });

    return `${url}?${searchParams.toString()}`;
  }

  /**
   * Build request headers
   */
  private buildHeaders(customHeaders?: Record<string, string>): HeadersInit {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders,
    };
  }

  /**
   * Handle the API response
   */
  private async handleResponse<T>(response: Response, endpoint: string): Promise<T> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (response.ok) {
      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      // Parse JSON response
      if (isJson) {
        return await response.json();
      }

      // Return text for non-JSON responses
      return (await response.text()) as any;
    }

    // Handle error responses
    let errorData: any;
    try {
      errorData = isJson ? await response.json() : await response.text();
    } catch {
      errorData = 'Unable to parse error response';
    }

    throw createErrorFromResponse(response.status, errorData, endpoint);
  }
}
