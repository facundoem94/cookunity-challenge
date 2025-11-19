import { test, expect } from '../../src/fixtures/baseApiTest';

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

  test('POST then PATCH', async ({ api, request }) => {
    const token = process.env.GOREST_TOKEN || '';
    expect(token, 'GOREST_TOKEN must be set').toBeTruthy();

    // Get a random user id from the users list (The challenge didn't specify a valid user id and without that the POST request would fail, so i found this endpoint to get a list of users and use the first one)
    const usersRes = await request.get(`${GOREST_BASE_URL}/users`);
    expect(usersRes.status()).toBe(200);
    const usersJson = await usersRes.json();
    const firstUserId = usersJson?.data?.[0]?.id;
    expect(firstUserId).toBeTruthy();

    // Create a new post
    const postRes = await api.post('/public/v1/posts', {
      data: {
        title: 'QA Challenge Initial Post',
        body: 'This post was created to test PATCH operations in the QA challenge.',
        user_id: firstUserId,
      },
    });

    // Validate the response status
    expect([200, 201]).toContain(postRes.status());

    // Get the created post
    const created = await postRes.json();
    const createdPostId = created?.data?.id;
    expect(createdPostId).toBeTruthy();

    // Update the post
    const patchRes = await api.patch(`/public/v1/posts/${createdPostId}`, {
      data: {
        title: 'Updated QA Challenge Post Title',
        body: 'This is a test update made during the QA automation challenge.',
      },
    });

    // Validate the response status
    expect([200, 201]).toContain(patchRes.status());
    
    const patched = await patchRes.json();

    // Validate the response data
    expect(patched?.data?.id).toBe(createdPostId);
    expect(patched?.data?.title).toBe('Updated QA Challenge Post Title');
  });
});


