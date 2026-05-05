import { env } from '../config/clientEnv.js';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

export const apiClient = async (endpoint, options = {}) => {
  const url = `${env.API_BASE_URL}${endpoint}`;
  console.log(`API Request: ${options.method || 'GET'} ${url}`);
  const res = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    let errorMessage = `HTTP ${res.status}`;
    try {
      const errorBody = await res.json();
      errorMessage = errorBody?.message || errorBody?.error || JSON.stringify(errorBody);
    } catch {
      try {
        errorMessage = await res.text();
      } catch { /* ignore */ }
    }
    throw new Error(errorMessage);
  }

  return res.json();
};

export const authHeaders = (apiKey = env.PAGE_API_KEY) => ({
  'Authorization': `Basic ${env.AUTH_JONNA_SERVER}`,
  'x-api-key': apiKey,
});
