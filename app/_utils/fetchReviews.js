export async function fetchReviewsBySlug(slug) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/reviews?populate=product`);
  const json = await res.json();

  if (!json?.data) return [];

  return json.data.filter((review) => review?.product?.slug === slug);
}
