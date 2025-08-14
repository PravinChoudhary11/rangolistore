// utils/strapiClient.js
const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function strapiRequest(path, method = 'GET', data = null) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${STRAPI_TOKEN}`,
  };

  const res = await fetch(`${STRAPI_BASE_URL}/api${path}`, {
    method,
    headers,
    body: data ? JSON.stringify({ data }) : undefined,
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error?.message || 'Strapi API Error');
  }
  return json.data;
}
