import CategoryPageWrapper from "./categoryWrapper";

export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/categories`);
  const data = await res.json();

  return (
    data?.data
      ?.map((cat) => {
        const slug = cat.attributes?.slug;
        return slug ? { slug } : null;
      })
      .filter(Boolean) // remove nulls
  );
}

async function getCategoryAndProducts(slug) {
  const base = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  const categoryRes = await fetch(`${base}/api/categories?filters[slug][$eq]=${slug}&populate=*`);
  const categoryData = await categoryRes.json();
  const category = categoryData.data?.[0];

  if (!category) return { category: null, products: [] };

  const productsRes = await fetch(`${base}/api/products?filters[categories][slug][$eq]=${slug}&populate=*`);
  const productsData = await productsRes.json();

  return {
    category,
    products: productsData?.data || [],
  };
}

const CategoryPage = async ({ params }) => {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const { category, products } = await getCategoryAndProducts(resolvedParams.slug);

  return <CategoryPageWrapper category={category} products={products} />;
};

export default CategoryPage;