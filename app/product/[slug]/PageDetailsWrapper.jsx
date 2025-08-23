// app/product/[slug]/PageDetailsWrapper.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNavigationLoading } from '@/contexts/NavigationLoadingContext';
import PageDetails from './PageDetails';

const PageDetailsWrapper = ({ product, slug }) => {
  const router = useRouter();
  const { stopLoading } = useNavigationLoading();
  const [isClient, setIsClient] = useState(false);

  // Fix hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Stop loading when component is ready and product is available
  useEffect(() => {
    if (isClient && product) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        stopLoading();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isClient, product, stopLoading]);

  // If not yet mounted on client, let the navigation loading handle it
  if (!isClient) {
    return null; // Navigation loading will show
  }

  // If product is null, show not found immediately and stop loading
  if (!product) {
    // Stop the loading animation
    stopLoading();
    
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

  // Render the actual product details
  return <PageDetails product={product} />;
};

export default PageDetailsWrapper;