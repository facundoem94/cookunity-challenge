import { test as base, expect, request, type APIRequestContext } from '@playwright/test';

const GOREST_BASE_URL = 'https://gorest.co.in/public/v1';

export const test = base.extend<{ api: APIRequestContext }>({
  api: async ({}, use) => {
    const token = process.env.GOREST_TOKEN || '';
    const api = await request.newContext({
      baseURL: GOREST_BASE_URL,
      extraHTTPHeaders: token
        ? {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        : { 'Content-Type': 'application/json' },
    });
    await use(api);
    await api.dispose();
  },
});

export { expect };


