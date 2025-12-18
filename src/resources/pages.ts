/**
 * Pages resource for Optimizely API
 */

import { HttpClient } from "../http-client";
import { Page } from "../types";

export class Pages {
  constructor(private readonly httpClient: HttpClient) {}

  /**
   * List all pages for a project
   * @param projectId - The project ID
   * @returns Array of pages
   */
  async list(projectId: string): Promise<Page[]> {
    if (!projectId) {
      throw new Error("Project ID is required");
    }
    return this.httpClient.get<Page[]>(
      `/pages?project_id=${projectId}&archived=false`
    );
  }

  /**
   * Get a specific page by ID
   * @param pageId - The page ID
   * @returns Page details
   */
  async get(pageId: string): Promise<Page> {
    if (!pageId) {
      throw new Error("Page ID is required");
    }
    return this.httpClient.get<Page>(`/pages/${Number(pageId)}`);
  }

  /**
   * Create a new page
   * @param projectId - The project ID
   * @param data - Page data
   * @returns Created page
   */
  async create(
    projectId: string,
    data: {
      name: string;
      description?: string;
      edit_url: string;
      page_type: "single_url" | "url_set" | "global";
      category?: string;
      conditions: any;
    }
  ): Promise<Page> {
    if (!projectId) {
      throw new Error("Project ID is required");
    }
    if (!data.name) {
      throw new Error("Page name is required");
    }
    return this.httpClient.post<Page>(`/pages`, {
      ...data,
      project_id: Number(projectId),
    });
  }

  /**
   * Update an existing page
   * @param pageId - The page ID
   * @param data - Updated page data
   * @returns Updated page
   */
  async update(
    pageId: string,
    data: Partial<{
      name: string;
      description: string;
      edit_url: string;
      page_type: string;
      category: string;
      conditions: any;
      archived: boolean;
    }>
  ): Promise<Page> {
    if (!pageId) {
      throw new Error("Page ID is required");
    }
    return this.httpClient.patch<Page>(`/pages/${Number(pageId)}`, data);
  }

  /**
   * Archive a page
   * @param pageId - The page ID
   * @returns Updated page
   */
  async archive(pageId: string): Promise<Page> {
    return this.update(pageId, { archived: true });
  }

  /**
   * Delete (archive) a page
   * @param pageId - The page ID
   */
  async delete(pageId: string): Promise<void> {
    if (!pageId) {
      throw new Error("Page ID is required");
    }
    await this.httpClient.delete(`/pages/${Number(pageId)}`);
  }
}
