// app/product/[slug]/PageDetailsWrapper.jsx
'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Dynamically import PageDetails for client-side only
const PageDetails = dynamic(() => import('./PageDetails'), {
  ssr: false,
  loading: () => <ProductLoadingSkeleton />
});

// Loading skeleton component
const ProductLoadingSkeleton = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen animate-pulse">
      <div className="max-w-7xl mx-auto px-4 pb-16 sm:px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 pt-8">
          {/* Image Gallery Skeleton */}
          <div className="space-y-4">
            {/* Main Image Skeleton */}
            <div className="relative aspect-square rounded-2xl bg-gray-200 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
            </div>
            
            {/* Thumbnail Skeleton */}
            <div className="flex justify-center gap-3 py-2">
              {[...Array(5)].map((_, index) => (
                <div 
                  key={index}
                  className="w-20 h-20 rounded-xl bg-gray-200 animate-shimmer"
                ></div>
              ))}
            </div>
          </div>

          {/* Product Details Skeleton */}
          <div className="py-2 space-y-6">
            {/* Category & Rating Skeleton */}
            <div className="flex items-center justify-between">
              <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Title Skeleton */}
            <div className="space-y-2">
              <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-8 w-1/2 bg-gray-200 rounded"></div>
            </div>

            {/* Description Skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            </div>

            {/* Pricing Skeleton */}
            <div className="bg-gray-100 rounded-2xl p-6">
              <div className="flex items-baseline gap-3 mb-2">
                <div className="h-8 w-32 bg-gray-200 rounded"></div>
                <div className="h-6 w-24 bg-gray-200 rounded"></div>
                <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
              </div>
              <div className="h-4 w-40 bg-gray-200 rounded"></div>
            </div>

            {/* Quantity Skeleton */}
            <div>
              <div className="h-6 w-20 bg-gray-200 rounded mb-3"></div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="w-16 h-6 bg-gray-200 rounded"></div>
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              </div>
            </div>

            {/* Buttons Skeleton */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
              <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
            </div>

            {/* Trust Badges Skeleton */}
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-100 rounded-xl">
                  <div className="w-6 h-6 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -468px 0;
          }
          100% {
            background-position: 468px 0;
          }
        }
        
        .animate-shimmer {
          background: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
          background-size: 800px 104px;
          animation: shimmer 1.5s infinite linear;
        }
      `}</style>
    </div>
  );
};

const PageDetailsWrapper = ({ product, slug }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Small delay to ensure smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // If product is null, it means it wasn't found
  if (!product && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="text-center max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">
            The product "{slug}" you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  // Show loading skeleton while loading
  if (isLoading) {
    return <ProductLoadingSkeleton />;
  }

  // Render the actual product details
  return <PageDetails product={product} />;
};

export default PageDetailsWrapper;