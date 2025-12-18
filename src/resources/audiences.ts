/**
 * Audiences resource for Optimizely API
 */

import { HttpClient } from '../http-client';
import { Audience } from '../types';

export class Audiences {
  constructor(private readonly httpClient: HttpClient) {}

  /**
   * List all audiences for a project
   * @param projectId - The project ID
   * @returns Array of audiences
   */
  async list(projectId: string): Promise<Audience[]> {
    if (!projectId) {
      throw new Error('Project ID is required');
    }
    return this.httpClient.get<Audience[]>(`/audiences?project_id=${projectId}&archived=false`);
  }

  /**
   * Get a specific audience by ID
   * @param audienceId - The audience ID
   * @returns Audience details
   */
  async get(audienceId: string): Promise<Audience> {
    if (!audienceId) {
      throw new Error('Audience ID is required');
    }
    return this.httpClient.get<Audience>(`/audiences/${audienceId}`);
  }

  /**
   * Create a new audience
   * @param projectId - The project ID
   * @param data - Audience data
   * @returns Created audience
   */
  async create(
    projectId: string,
    data: {
      name: string;
      description?: string;
      conditions?: string;
    }
  ): Promise<Audience> {
    if (!projectId) {
      throw new Error('Project ID is required');
    }
    if (!data.name) {
      throw new Error('Audience name is required');
    }
    return this.httpClient.post<Audience>(`/projects/${projectId}/audiences`, data);
  }

  /**
   * Update an existing audience
   * @param audienceId - The audience ID
   * @param data - Updated audience data
   * @returns Updated audience
   */
  async update(
    audienceId: string,
    data: Partial<{
      name: string;
      description: string;
      conditions: string;
    }>
  ): Promise<Audience> {
    if (!audienceId) {
      throw new Error('Audience ID is required');
    }
    return this.httpClient.patch<Audience>(`/audiences/${audienceId}`, data);
  }

  /**
   * Delete an audience
   * @param audienceId - The audience ID
   */
  async delete(audienceId: string): Promise<void> {
    if (!audienceId) {
      throw new Error('Audience ID is required');
    }
    await this.httpClient.delete(`/audiences/${audienceId}`);
  }
}
