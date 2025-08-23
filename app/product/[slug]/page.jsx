// app/product/[slug]/page.jsx
import { notFound } from 'next/navigation';
import PageDetailsWrapper from './PageDetailsWrapper';

// Generate static params for better performance
export async function generateStaticParams() {
  try {
    // Add error handling and timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/products?populate=*&pagination[limit]=100`,
      {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      console.error('Failed to fetch products for static generation:', res.status);
      return [];
    }

    const data = await res.json();

    if (!data?.data) {
      console.warn('No product data received for static generation');
      return [];
    }

    const params = data.data
      .filter(product => product.slug && typeof product.slug === 'string')
      .map(product => ({ 
        slug: product.slug.toString() 
      }))
      .slice(0, 50); // Limit to prevent build timeouts

    return params;
    
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Improved product fetching with better error handling
async function getProduct(slug) {
  if (!slug || typeof slug !== 'string') {
    console.error('Invalid slug provided:', slug);
    return null;
  }

  try {
    // Add timeout and proper headers
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const encodedSlug = encodeURIComponent(slug);
    const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/products?filters[slug][$eq]=${encodedSlug}&populate=*`;
    
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // Remove cache settings that might cause issues
      next: { 
        revalidate: process.env.NODE_ENV === 'production' ? 300 : 0 // 5 minutes in prod, no cache in dev
      }
    });
    
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error(`Failed to fetch product: ${res.status} ${res.statusText}`);
      
      // If it's a 404, return null (product not found)
      if (res.status === 404) {
        return null;
      }
      
      // For other errors, throw to trigger error boundary
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    if (!data?.data) {
      console.warn('No data in API response:', data);
      return null;
    }

    if (!Array.isArray(data.data) || data.data.length === 0) {
      console.warn('Product not found in API response:', slug);
      return null;
    }

    const product = data.data[0];
    
    // Validate product structure
    if (!product.id || !product.name) {
      console.error('Invalid product structure:', product);
      return null;
    }
    
    return product;

  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Product fetch timeout for slug:', slug);
    } else {
      console.error('Error fetching product:', error);
    }
    
    // In development, you might want to throw the error
    // In production, return null to show "not found" instead of crashing
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error details:', error);
    }
    
    return null;
  }
}

// Add metadata generation for better SEO
export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await params;
    const product = await getProduct(resolvedParams.slug);
    
    if (!product) {
      return {
        title: 'Product Not Found',
        description: 'The requested product could not be found.',
      };
    }

    return {
      title: product.name || 'Product Details',
      description: product.description?.substring(0, 160) || 'View product details and specifications.',
      openGraph: {
        title: product.name,
        description: product.description?.substring(0, 160),
        images: product.images?.[0]?.url ? [{
          url: product.images[0].url,
          width: 800,
          height: 600,
          alt: product.name,
        }] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Product Details',
      description: 'View product details and specifications.',
    };
  }
}

const ProductPage = async ({ params }) => {
  try {
    // Await params before accessing its properties (Next.js 15 requirement)
    const resolvedParams = await params;
    
    if (!resolvedParams.slug) {
      console.error('No slug provided to ProductPage');
      notFound();
    }

    // Fetch the product
    const product = await getProduct(resolvedParams.slug);
    
    if (!product) {
      console.log('Product not found, triggering 404');
      notFound();
    }

    // Render the product page wrapper
    return (
      <main className="min-h-screen">
        <PageDetailsWrapper 
          product={product} 
          slug={resolvedParams.slug} 
        />
      </main>
    );
    
  } catch (error) {
    console.error('Error in ProductPage:', error);
    
    // In case of any unexpected errors, show not found
    notFound();
  }
};

export default ProductPage;