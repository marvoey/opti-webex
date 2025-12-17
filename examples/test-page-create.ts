/**
 * Test page creation to diagnose the specific error
 */

import 'dotenv/config';
import { OptimizelyClient } from '../src';

async function testPageCreation() {
  const client = new OptimizelyClient({
    token: process.env.OPTIMIZELY_TOKEN || '',
  });

  try {
    // Get a project to work with
    console.log('Fetching projects...');
    const projects = await client.projects.list();
    const projectId = projects[0]?.id;

    if (!projectId) {
      console.error('No projects found');
      return;
    }

    console.log(`Using project: ${projects[0].name} (ID: ${projectId})\n`);

    // Try to create a page
    console.log('Creating page...');
    const page = await client.pages.create(projectId, {
      name: 'Test Page ' + Date.now(),
      description: 'Test page created via API',
      edit_url: 'https://example.com/test',
    });

    console.log('✓ Page created successfully:');
    console.log(page);
  } catch (error: any) {
    console.error('✗ Error creating page:', error.constructor.name);
    console.error('Message:', error.message);
    if (error.status) {
      console.error('Status:', error.status);
    }
    if (error.details) {
      console.error('Details:', JSON.stringify(error.details, null, 2));
    }
  }
}

testPageCreation();
