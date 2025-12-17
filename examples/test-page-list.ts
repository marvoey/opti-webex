/**
 * Test listing pages for a project
 */

import 'dotenv/config';
import { OptimizelyClient } from '../src';

async function testPageList() {
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

    // List pages for the project
    console.log('Listing pages...');
    const pages = await client.pages.list(projectId);

    console.log(`✓ Found ${pages.length} page(s):\n`);
    pages.forEach((page, index) => {
      console.log(`${index + 1}. ${page.name}`);
      console.log(`   ID: ${page.id}`);
      console.log(`   Edit URL: ${page.edit_url || 'N/A'}`);
      console.log(`   Archived: ${page.archived}`);
      console.log('');
    });
  } catch (error: any) {
    console.error('✗ Error listing pages:', error.constructor.name);
    console.error('Message:', error.message);
    if (error.details) {
      console.error('Details:', JSON.stringify(error.details, null, 2));
    }
  }
}

testPageList();
