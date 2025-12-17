/**
 * Test authentication with Optimizely API
 * This script helps debug authentication issues
 */

import 'dotenv/config';
import { OptimizelyClient, AuthenticationError } from '../src';

async function testAuthentication() {
  console.log('Testing Optimizely Authentication...\n');

  // Check if token is set
  const token = process.env.OPTIMIZELY_TOKEN;
  if (!token) {
    console.error('ERROR: OPTIMIZELY_TOKEN is not set in .env file');
    console.log('Please set your token in .env file:');
    console.log('OPTIMIZELY_TOKEN=your_actual_token_here');
    process.exit(1);
  }

  console.log('Token found:', token.substring(0, 10) + '...');
  console.log('Token length:', token.length);
  console.log('Token format:', token.includes(':') ? 'Contains colon (possibly correct)' : 'No colon detected');
  console.log('');

  // Test 1: Initialize client
  try {
    const client = new OptimizelyClient({ token });
    console.log('✓ Client initialized successfully\n');

    // Test 2: Make a simple API call to list projects
    console.log('Testing API call: Listing projects...');
    const projects = await client.projects.list();
    console.log('✓ Authentication successful!');
    console.log(`Found ${projects.length} project(s):\n`);

    projects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.name} (ID: ${project.id})`);
    });

    return projects;
  } catch (error) {
    console.error('\n✗ Authentication failed!\n');

    if (error instanceof AuthenticationError) {
      console.error('Authentication Error:', error.message);
      console.log('\nPossible issues:');
      console.log('1. Token has expired - generate a new token at:');
      console.log('   https://app.optimizely.com/');
      console.log('   Go to: Profile → API Access → Generate Token\n');
      console.log('2. Token format is incorrect - it should look like:');
      console.log('   2:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n');
      console.log('3. Token has insufficient permissions\n');
    } else {
      console.error('Unexpected error:', error);
    }

    process.exit(1);
  }
}

// Run the test
testAuthentication().catch(console.error);
