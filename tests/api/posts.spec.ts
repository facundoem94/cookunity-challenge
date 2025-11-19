import { test, expect } from './fixtures';

const GOREST_BASE_URL = 'https://gorest.co.in/public/v1';

test.describe('GoRest API', () => {
  test('GET list then GET detail', async ({ request }) => {
    const listRes = await request.get(`${GOREST_BASE_URL}/posts`);
    expect(listRes.status()).toBe(200);
    const listJson = await listRes.json();
    const firstId = listJson?.data?.[0]?.id;
    expect(firstId).toBeTruthy();

    const detailRes = await request.get(`${GOREST_BASE_URL}/posts/${firstId}`);
    expect(detailRes.status()).toBe(200);
    const detailJson = await detailRes.json();
    expect(detailJson?.data?.id).toBe(firstId);
  });

  test('POST then PATCH', async ({ api }) => {
    const token = process.env.GOREST_TOKEN || '';
    const userId = process.env.GOREST_USER_ID || '';
    expect(token, 'GOREST_TOKEN must be set').toBeTruthy();
    expect(userId, 'GOREST_USER_ID must be set').toBeTruthy();

    const postRes = await api.post('/posts', {
      data: {
        title: 'QA Challenge Initial Post',
        body: 'This post was created to test PATCH operations in the QA challenge.',
        user_id: userId,
      },
    });
    expect([200, 201]).toContain(postRes.status());
    const created = await postRes.json();
    const createdPostId = created?.data?.id;
    expect(createdPostId).toBeTruthy();

    const patchRes = await api.patch(`/posts/${createdPostId}`, {
      data: {
        title: 'Updated QA Challenge Post Title',
        body: 'This is a test update made during the QA automation challenge.',
      },
    });
    expect([200, 201]).toContain(patchRes.status());
    const patched = await patchRes.json();
    expect(patched?.data?.id).toBe(createdPostId);
    expect(patched?.data?.title).toBe('Updated QA Challenge Post Title');
  });
});


