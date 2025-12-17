/**
 * Example: Create a new page in Optimizely
 */

import "dotenv/config";
import { OptimizelyClient } from "../src";

async function createPageExample() {
  // Initialize the client with your personal access token
  const client = new OptimizelyClient({
    token: process.env.OPTIMIZELY_TOKEN || "your_token_here",
  });

  try {
    // Get project ID from environment variable (convert to string for API)
    const projectId = process.env.OPTIMIZELY_PROJECT_ID || "your_project_id";

    if (!projectId || projectId === "your_project_id") {
      throw new Error("Please set OPTIMIZELY_PROJECT_ID in your .env file");
    }

    // Conditions object
    const conditions = [
      "and",
      ["or", { match_type: "simple", type: "url", value: "datadoghq.com" }],
    ];

    // Create a new page with minimal required fields
    const simplePage = await client.pages.create(projectId, {
      name: Date.now() + " REST API test",
      edit_url: "https://datadoghq.com",
      page_type: "single_url",
      conditions: JSON.stringify(conditions),
    });

    console.log("Created simple page:", simplePage);
  } catch (error) {
    console.error("Error creating page:", error);
  }
}

// Run the example
createPageExample();
