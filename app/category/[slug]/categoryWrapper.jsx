//category/[slug]/categorywrapper.jsx
'use client';

import dynamic from 'next/dynamic';

// Dynamically import the actual page component for client-side only
const CategoryPage = dynamic(() => import('./CategoryPage'), {
  ssr: false,
});

const CategoryPageWrapper = ({ category, products }) => {
  return <CategoryPage category={category} products={products} />;
};

export default CategoryPageWrapper;
