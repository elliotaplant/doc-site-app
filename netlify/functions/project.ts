import { Handler } from '@netlify/functions';
import { fetchBackend } from '../backend';
import { USER_ID } from '../constants';

const handler: Handler = async (event, context) => {
  const response = await fetchBackend(`/projects?userId=${USER_ID}`);
  const body = await response.text();

  // Return the existing projects
  if (event.httpMethod === 'GET') {
    return { statusCode: 200, body };
  }

  let existingProjects = JSON.parse(body);
  if (!Array.isArray(existingProjects)) {
    existingProjects = [];
  }
  // Create a project
  if (event.httpMethod === 'POST') {
    const { projectId, rootFileId } = JSON.parse(event.body || '');
    // TODO: Put this in a real database.
    // TODO: Make sure project id's are unique
    // TODO: Make sure the projectId actually belongs to the user in google
    if (!projectId && !rootFileId) {
      throw new Error('No projectId and rootFileId provided');
    }

    const newProject = { projectId, rootFileId };
    const requestBody = JSON.stringify([...existingProjects, newProject]);
    const response = await fetchBackend(`/projects?userId=${USER_ID}`, {
      method: 'POST',
      body: requestBody,
    });

    const responseBody = await response.text();
    return { statusCode: 201, body: responseBody };
  }

  return { statusCode: 405, body: 'Method not allowed' };
};

export { handler };
