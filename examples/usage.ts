/**
 * Example usage of the Optimizely Web Experimentation API Client
 */

import { OptimizelyClient, OptimizelyError, AuthenticationError } from '../src';

// Initialize the client
const client = new OptimizelyClient({
  token: process.env.OPTIMIZELY_TOKEN || 'your_personal_access_token',
  // Optional: customize base URL and timeout
  // baseUrl: 'https://api.optimizely.com/v2',
  // timeout: 30000,
});

/**
 * Example 1: List all projects
 */
async function listProjects() {
  try {
    const projects = await client.projects.list();
    console.log('Projects:', projects);
    return projects;
  } catch (error) {
    if (error instanceof AuthenticationError) {
      console.error('Invalid token:', error.message);
    } else if (error instanceof OptimizelyError) {
      console.error('API Error:', error.message, error.status);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

/**
 * Example 2: Get a specific project
 */
async function getProject(projectId: string) {
  try {
    const project = await client.projects.get(projectId);
    console.log('Project details:', project);
    return project;
  } catch (error) {
    if (error instanceof OptimizelyError) {
      console.error(`Failed to get project: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Example 3: Create a new project
 */
async function createProject() {
  try {
    const newProject = await client.projects.create({
      name: 'My New Project',
      account_id: 'your_account_id',
      platform: 'web',
      status: 'active',
    });
    console.log('Created project:', newProject);
    return newProject;
  } catch (error) {
    console.error('Failed to create project:', error);
  }
}

/**
 * Example 4: Update a project
 */
async function updateProject(projectId: string) {
  try {
    const updatedProject = await client.projects.update(projectId, {
      name: 'Updated Project Name',
    });
    console.log('Updated project:', updatedProject);
    return updatedProject;
  } catch (error) {
    console.error('Failed to update project:', error);
  }
}

/**
 * Example 5: Archive a project
 */
async function archiveProject(projectId: string) {
  try {
    const archivedProject = await client.projects.archive(projectId);
    console.log('Archived project:', archivedProject);
    return archivedProject;
  } catch (error) {
    console.error('Failed to archive project:', error);
  }
}

/**
 * Example 6: List experiments for a project
 */
async function listExperiments(projectId: string) {
  try {
    const experiments = await client.experiments.list(projectId);
    console.log('Experiments:', experiments);
    return experiments;
  } catch (error) {
    console.error('Failed to list experiments:', error);
  }
}

/**
 * Example 7: Create a new experiment
 */
async function createExperiment(projectId: string) {
  try {
    const newExperiment = await client.experiments.create(projectId, {
      name: 'My A/B Test',
      description: 'Testing button colors',
      type: 'a/b',
      status: 'not_started',
    });
    console.log('Created experiment:', newExperiment);
    return newExperiment;
  } catch (error) {
    console.error('Failed to create experiment:', error);
  }
}

/**
 * Example 8: Start an experiment
 */
async function startExperiment(experimentId: string) {
  try {
    const experiment = await client.experiments.start(experimentId);
    console.log('Started experiment:', experiment);
    return experiment;
  } catch (error) {
    console.error('Failed to start experiment:', error);
  }
}

/**
 * Example 9: List audiences for a project
 */
async function listAudiences(projectId: string) {
  try {
    const audiences = await client.audiences.list(projectId);
    console.log('Audiences:', audiences);
    return audiences;
  } catch (error) {
    console.error('Failed to list audiences:', error);
  }
}

/**
 * Example 10: Create a new audience
 */
async function createAudience(projectId: string) {
  try {
    const newAudience = await client.audiences.create(projectId, {
      name: 'Mobile Users',
      description: 'Users on mobile devices',
      conditions: '["and", ["or", ["device_type", "mobile"]]]',
    });
    console.log('Created audience:', newAudience);
    return newAudience;
  } catch (error) {
    console.error('Failed to create audience:', error);
  }
}

/**
 * Example 11: Make a custom API request
 */
async function customRequest() {
  try {
    // For endpoints not yet covered by the client
    const response = await client.request('/custom-endpoint', {
      method: 'GET',
      params: { filter: 'active' },
    });
    console.log('Custom response:', response);
    return response;
  } catch (error) {
    console.error('Custom request failed:', error);
  }
}

/**
 * Example 12: Error handling with different error types
 */
async function errorHandlingExample() {
  try {
    await client.projects.get('invalid-id');
  } catch (error) {
    if (error instanceof AuthenticationError) {
      console.error('Authentication failed - check your token');
    } else if (error instanceof OptimizelyError) {
      console.error('API error:', {
        message: error.message,
        status: error.status,
        code: error.code,
        details: error.details,
      });
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

// Run examples
async function main() {
  console.log('Running Optimizely API examples...\n');

  // Uncomment the examples you want to run
  await listProjects();
  // await getProject('your_project_id');
  // await createProject();
  // await listExperiments('your_project_id');
  // await errorHandlingExample();
}

// Execute if run directly
if (require.main === module) {
  main().catch(console.error);
}

export {
  listProjects,
  getProject,
  createProject,
  updateProject,
  archiveProject,
  listExperiments,
  createExperiment,
  startExperiment,
  listAudiences,
  createAudience,
  customRequest,
  errorHandlingExample,
};
