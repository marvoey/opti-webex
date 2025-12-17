/**
 * Projects resource for Optimizely API
 */

import { HttpClient } from '../http-client';
import { Project } from '../types';

export class Projects {
  constructor(private readonly httpClient: HttpClient) {}

  /**
   * List all projects
   * @returns Array of projects
   */
  async list(): Promise<Project[]> {
    return this.httpClient.get<Project[]>('/projects');
  }

  /**
   * Get a specific project by ID
   * @param projectId - The project ID
   * @returns Project details
   */
  async get(projectId: string): Promise<Project> {
    if (!projectId) {
      throw new Error('Project ID is required');
    }
    return this.httpClient.get<Project>(`/projects/${projectId}`);
  }

  /**
   * Create a new project
   * @param data - Project data
   * @returns Created project
   */
  async create(data: {
    name: string;
    account_id: string;
    platform?: string;
    status?: 'active' | 'archived';
  }): Promise<Project> {
    if (!data.name) {
      throw new Error('Project name is required');
    }
    if (!data.account_id) {
      throw new Error('Account ID is required');
    }
    return this.httpClient.post<Project>('/projects', data);
  }

  /**
   * Update an existing project
   * @param projectId - The project ID
   * @param data - Updated project data
   * @returns Updated project
   */
  async update(
    projectId: string,
    data: Partial<{
      name: string;
      status: 'active' | 'archived';
    }>
  ): Promise<Project> {
    if (!projectId) {
      throw new Error('Project ID is required');
    }
    return this.httpClient.patch<Project>(`/projects/${projectId}`, data);
  }

  /**
   * Archive a project
   * @param projectId - The project ID
   * @returns Archived project
   */
  async archive(projectId: string): Promise<Project> {
    return this.update(projectId, { status: 'archived' });
  }

  /**
   * Delete a project
   * @param projectId - The project ID
   */
  async delete(projectId: string): Promise<void> {
    if (!projectId) {
      throw new Error('Project ID is required');
    }
    await this.httpClient.delete(`/projects/${projectId}`);
  }
}
