/**
 * Experiments resource for Optimizely API
 */

import { HttpClient } from '../http-client';
import { Experiment } from '../types';

export class Experiments {
  constructor(private readonly httpClient: HttpClient) {}

  /**
   * List all experiments for a project
   * @param projectId - The project ID
   * @returns Array of experiments
   */
  async list(projectId: string): Promise<Experiment[]> {
    if (!projectId) {
      throw new Error('Project ID is required');
    }
    return this.httpClient.get<Experiment[]>(`/projects/${projectId}/experiments`);
  }

  /**
   * Get a specific experiment by ID
   * @param experimentId - The experiment ID
   * @returns Experiment details
   */
  async get(experimentId: string): Promise<Experiment> {
    if (!experimentId) {
      throw new Error('Experiment ID is required');
    }
    return this.httpClient.get<Experiment>(`/experiments/${experimentId}`);
  }

  /**
   * Create a new experiment
   * @param projectId - The project ID
   * @param data - Experiment data
   * @returns Created experiment
   */
  async create(
    projectId: string,
    data: {
      name: string;
      description?: string;
      type?: 'a/b' | 'multivariate' | 'multi-armed_bandit';
      status?: 'not_started' | 'running' | 'paused' | 'archived';
    }
  ): Promise<Experiment> {
    if (!projectId) {
      throw new Error('Project ID is required');
    }
    if (!data.name) {
      throw new Error('Experiment name is required');
    }
    return this.httpClient.post<Experiment>(`/projects/${projectId}/experiments`, data);
  }

  /**
   * Update an existing experiment
   * @param experimentId - The experiment ID
   * @param data - Updated experiment data
   * @returns Updated experiment
   */
  async update(
    experimentId: string,
    data: Partial<{
      name: string;
      description: string;
      status: 'not_started' | 'running' | 'paused' | 'archived';
    }>
  ): Promise<Experiment> {
    if (!experimentId) {
      throw new Error('Experiment ID is required');
    }
    return this.httpClient.patch<Experiment>(`/experiments/${experimentId}`, data);
  }

  /**
   * Start an experiment
   * @param experimentId - The experiment ID
   * @returns Updated experiment
   */
  async start(experimentId: string): Promise<Experiment> {
    return this.update(experimentId, { status: 'running' });
  }

  /**
   * Pause an experiment
   * @param experimentId - The experiment ID
   * @returns Updated experiment
   */
  async pause(experimentId: string): Promise<Experiment> {
    return this.update(experimentId, { status: 'paused' });
  }

  /**
   * Archive an experiment
   * @param experimentId - The experiment ID
   * @returns Updated experiment
   */
  async archive(experimentId: string): Promise<Experiment> {
    return this.update(experimentId, { status: 'archived' });
  }

  /**
   * Delete an experiment
   * @param experimentId - The experiment ID
   */
  async delete(experimentId: string): Promise<void> {
    if (!experimentId) {
      throw new Error('Experiment ID is required');
    }
    await this.httpClient.delete(`/experiments/${experimentId}`);
  }
}
