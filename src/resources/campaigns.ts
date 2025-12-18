/**
 * Campaigns resource for Optimizely API
 */

import { HttpClient } from '../http-client';
import { Campaign } from '../types';

export class Campaigns {
  constructor(private readonly httpClient: HttpClient) {}

  /**
   * List all campaigns for a project
   * @param projectId - The project ID
   * @returns Array of campaigns
   */
  async list(projectId: string): Promise<Campaign[]> {
    if (!projectId) {
      throw new Error('Project ID is required');
    }
    return this.httpClient.get<Campaign[]>(`/campaigns?project_id=${projectId}&archived=false`);
  }

  /**
   * Get a specific campaign by ID
   * @param campaignId - The campaign ID
   * @returns Campaign details
   */
  async get(campaignId: string): Promise<Campaign> {
    if (!campaignId) {
      throw new Error('Campaign ID is required');
    }
    return this.httpClient.get<Campaign>(`/campaigns/${campaignId}`);
  }

  /**
   * Create a new campaign
   * @param projectId - The project ID
   * @param data - Campaign data
   * @returns Created campaign
   */
  async create(
    projectId: string,
    data: {
      name: string;
      description?: string;
      status?: 'active' | 'paused' | 'archived' | 'not_started';
      type?: string;
      changes?: any[];
      experiments?: any[];
      metrics?: any[];
      holdback?: number;
    }
  ): Promise<Campaign> {
    if (!projectId) {
      throw new Error('Project ID is required');
    }
    if (!data.name) {
      throw new Error('Campaign name is required');
    }
    return this.httpClient.post<Campaign>(`/projects/${projectId}/campaigns`, data);
  }

  /**
   * Update an existing campaign
   * @param campaignId - The campaign ID
   * @param data - Updated campaign data
   * @returns Updated campaign
   */
  async update(
    campaignId: string,
    data: Partial<{
      name: string;
      description: string;
      status: 'active' | 'paused' | 'archived' | 'not_started';
      changes: any[];
      experiments: any[];
      metrics: any[];
      holdback: number;
    }>
  ): Promise<Campaign> {
    if (!campaignId) {
      throw new Error('Campaign ID is required');
    }
    return this.httpClient.patch<Campaign>(`/campaigns/${campaignId}`, data);
  }

  /**
   * Start a campaign
   * @param campaignId - The campaign ID
   * @returns Updated campaign
   */
  async start(campaignId: string): Promise<Campaign> {
    return this.update(campaignId, { status: 'active' });
  }

  /**
   * Pause a campaign
   * @param campaignId - The campaign ID
   * @returns Updated campaign
   */
  async pause(campaignId: string): Promise<Campaign> {
    return this.update(campaignId, { status: 'paused' });
  }

  /**
   * Archive a campaign
   * @param campaignId - The campaign ID
   * @returns Updated campaign
   */
  async archive(campaignId: string): Promise<Campaign> {
    return this.update(campaignId, { status: 'archived' });
  }

  /**
   * Delete a campaign
   * @param campaignId - The campaign ID
   */
  async delete(campaignId: string): Promise<void> {
    if (!campaignId) {
      throw new Error('Campaign ID is required');
    }
    await this.httpClient.delete(`/campaigns/${campaignId}`);
  }

  /**
   * Get campaign results
   * @param campaignId - The campaign ID
   * @returns Campaign results data
   */
  async getResults(campaignId: string): Promise<any> {
    if (!campaignId) {
      throw new Error('Campaign ID is required');
    }
    return this.httpClient.get(`/campaigns/${campaignId}/results`);
  }

  /**
   * Get sharable link for campaign results
   * @param campaignId - The campaign ID
   * @returns Sharable link data
   */
  async getShareableLink(campaignId: string): Promise<{ share_link: string }> {
    if (!campaignId) {
      throw new Error('Campaign ID is required');
    }
    return this.httpClient.get(`/campaigns/${campaignId}/share_link`);
  }

  /**
   * Get campaign results as CSV
   * @param campaignId - The campaign ID
   * @returns CSV data
   */
  async getResultsCSV(campaignId: string): Promise<string> {
    if (!campaignId) {
      throw new Error('Campaign ID is required');
    }
    return this.httpClient.get(`/campaigns/${campaignId}/results.csv`);
  }
}
