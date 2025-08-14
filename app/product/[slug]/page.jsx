// app/product/[slug]/page.jsx
import PageDetailsWrapper from './PageDetailsWrapper';

export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/products?populate=*`);
    const data = await res.json();

    if (!data?.data) return [];

    return data.data
      .filter(product => product.slug)
      .map(product => ({ slug: product.slug }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

async function getProduct(slug) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/products?filters[slug][$eq]=${slug}&populate=*`,
      {
        // Add cache and revalidation options for better performance
        next: { revalidate: 60 } // Revalidate every 60 seconds
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch product: ${res.status}`);
    }

    const data = await res.json();

    if (!data?.data || data.data.length === 0) return null;

    return data.data[0];
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

const ProductPage = async ({ params }) => {
  // Await params before accessing its properties (Next.js 15 requirement)
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  return <PageDetailsWrapper product={product} slug={resolvedParams.slug} />;
};

export default ProductPage;