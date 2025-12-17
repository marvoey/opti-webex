# Optimizely Web Experimentation API Client

A TypeScript/JavaScript wrapper for the [Optimizely Web Experimentation REST API](https://docs.developers.optimizely.com/web-experimentation/docs/rest-api-getting-started). This client provides a simple, type-safe interface for interacting with Optimizely's API.

## Features

- Written in TypeScript with full type definitions
- Works in Node.js (18+) and modern browsers
- Promise-based async/await API
- Comprehensive error handling with typed errors
- Support for Projects, Experiments, and Audiences
- Request timeout and abort support
- Zero dependencies (uses native `fetch` API)

## Installation

```bash
npm install optimizely-client
```

## Quick Start

```typescript
import { OptimizelyClient } from 'optimizely-client';

// Initialize the client
const client = new OptimizelyClient({
  token: 'your_personal_access_token'
});

// List all projects
const projects = await client.projects.list();
console.log(projects);

// Get a specific project
const project = await client.projects.get('project_id');

// List experiments for a project
const experiments = await client.experiments.list('project_id');
```

## Authentication

Get your personal access token from Optimizely:

1. Log in to [app.optimizely.com](https://app.optimizely.com)
2. Navigate to Profile → API Access
3. Click "Generate New Token"
4. Copy the token value

### Using Environment Variables

```typescript
const client = new OptimizelyClient({
  token: process.env.OPTIMIZELY_TOKEN
});
```

## Configuration

```typescript
const client = new OptimizelyClient({
  token: 'your_token',           // Required
  baseUrl?: 'custom_base_url',   // Optional (defaults to https://api.optimizely.com/v2)
  timeout?: 30000                // Optional (defaults to 30000ms)
});
```

## API Reference

### Projects

```typescript
// List all projects
const projects = await client.projects.list();

// Get a project by ID
const project = await client.projects.get('project_id');

// Create a new project
const newProject = await client.projects.create({
  name: 'My Project',
  account_id: 'account_id',
  platform: 'web',
  status: 'active'
});

// Update a project
const updated = await client.projects.update('project_id', {
  name: 'Updated Name'
});

// Archive a project
const archived = await client.projects.archive('project_id');

// Delete a project
await client.projects.delete('project_id');
```

### Experiments

```typescript
// List experiments for a project
const experiments = await client.experiments.list('project_id');

// Get an experiment by ID
const experiment = await client.experiments.get('experiment_id');

// Create a new experiment
const newExperiment = await client.experiments.create('project_id', {
  name: 'My A/B Test',
  description: 'Testing button colors',
  type: 'a/b',
  status: 'not_started'
});

// Update an experiment
const updated = await client.experiments.update('experiment_id', {
  name: 'Updated Name',
  status: 'running'
});

// Start an experiment
await client.experiments.start('experiment_id');

// Pause an experiment
await client.experiments.pause('experiment_id');

// Archive an experiment
await client.experiments.archive('experiment_id');

// Delete an experiment
await client.experiments.delete('experiment_id');
```

### Audiences

```typescript
// List audiences for a project
const audiences = await client.audiences.list('project_id');

// Get an audience by ID
const audience = await client.audiences.get('audience_id');

// Create a new audience
const newAudience = await client.audiences.create('project_id', {
  name: 'Mobile Users',
  description: 'Users on mobile devices',
  conditions: '["and", ["or", ["device_type", "mobile"]]]'
});

// Update an audience
const updated = await client.audiences.update('audience_id', {
  name: 'Updated Name'
});

// Delete an audience
await client.audiences.delete('audience_id');
```

### Custom Requests

For endpoints not yet covered by the client:

```typescript
const response = await client.request('/custom-endpoint', {
  method: 'GET',
  params: { filter: 'active' },
  body: { data: 'value' }
});
```

## Error Handling

The client provides typed error classes for different scenarios:

```typescript
import {
  OptimizelyError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  ServerError,
  NetworkError
} from 'optimizely-client';

try {
  const project = await client.projects.get('invalid-id');
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Invalid token');
  } else if (error instanceof NotFoundError) {
    console.error('Project not found');
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded');
  } else if (error instanceof OptimizelyError) {
    console.error('API error:', error.message, error.status);
  }
}
```

### Error Properties

All error classes extend `OptimizelyError` and include:

- `message`: Error description
- `status`: HTTP status code (if applicable)
- `code`: Error code (e.g., 'AUTHENTICATION_ERROR')
- `details`: Additional error details

## Framework Integration

### Next.js

```typescript
// app/api/optimizely/route.ts
import { OptimizelyClient } from 'optimizely-client';

const client = new OptimizelyClient({
  token: process.env.OPTIMIZELY_TOKEN
});

export async function GET() {
  const projects = await client.projects.list();
  return Response.json(projects);
}
```

### React

```typescript
import { OptimizelyClient } from 'optimizely-client';
import { useEffect, useState } from 'react';

const client = new OptimizelyClient({
  token: process.env.REACT_APP_OPTIMIZELY_TOKEN
});

function ProjectsList() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    client.projects.list().then(setProjects);
  }, []);

  return (
    <ul>
      {projects.map(project => (
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  );
}
```

### Astro.js

```typescript
---
// pages/projects.astro
import { OptimizelyClient } from 'optimizely-client';

const client = new OptimizelyClient({
  token: import.meta.env.OPTIMIZELY_TOKEN
});

const projects = await client.projects.list();
---

<ul>
  {projects.map(project => (
    <li>{project.name}</li>
  ))}
</ul>
```

### Vue

```vue
<script setup lang="ts">
import { OptimizelyClient } from 'optimizely-client';
import { ref, onMounted } from 'vue';

const client = new OptimizelyClient({
  token: import.meta.env.VITE_OPTIMIZELY_TOKEN
});

const projects = ref([]);

onMounted(async () => {
  projects.value = await client.projects.list();
});
</script>

<template>
  <ul>
    <li v-for="project in projects" :key="project.id">
      {{ project.name }}
    </li>
  </ul>
</template>
```

### Svelte

```svelte
<script lang="ts">
  import { OptimizelyClient } from 'optimizely-client';
  import { onMount } from 'svelte';

  const client = new OptimizelyClient({
    token: import.meta.env.VITE_OPTIMIZELY_TOKEN
  });

  let projects = [];

  onMount(async () => {
    projects = await client.projects.list();
  });
</script>

<ul>
  {#each projects as project}
    <li>{project.name}</li>
  {/each}
</ul>
```

## TypeScript Support

The client is written in TypeScript and provides full type definitions:

```typescript
import type { Project, Experiment, Audience } from 'optimizely-client';

const project: Project = await client.projects.get('project_id');
```

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Watch mode for development
npm run dev

# Run examples
npm run example
```

## Requirements

- Node.js 18+ (for native `fetch` support)
- Modern browser with `fetch` API support

## License

MIT

## Resources

- [Optimizely Web Experimentation API Documentation](https://docs.developers.optimizely.com/web-experimentation/docs/rest-api-getting-started)
- [Optimizely Developer Portal](https://developers.optimizely.com/)
