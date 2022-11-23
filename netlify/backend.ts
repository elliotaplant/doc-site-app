import fetch, { RequestInit } from 'node-fetch';

export function fetchBackend(path: string, options: RequestInit = {}) {
  return fetch(process.env.BACKEND_URL + path || '', {
    headers: { Authorization: process.env.AUTH_TOKEN || '' },
    ...options,
  });
}
