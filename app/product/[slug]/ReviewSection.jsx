'use client';
import React, { useEffect, useState } from 'react';
import { 
  FiStar,
  FiThumbsUp,
  FiThumbsDown,
  FiMoreHorizontal,
  FiEdit3,
  FiFilter,
  FiCheckCircle
} from 'react-icons/fi';
import { fetchReviewsBySlug } from '@/app/_utils/fetchReviews';

const ReviewSection = ({ product, onReviewLoad  }) => {
  // Review system states
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userReview, setUserReview] = useState({
    rating: 5,
    title: '',
    review: '',
    name: '',
    verified: false
  });
  const [sortBy, setSortBy] = useState('newest');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    async function loadReviews() {
      try {
        setLoading(true);
        const res = await fetchReviewsBySlug(product.slug);
        setReviews(res || []);
        onReviewLoad?.(res?.length || 0);
      } catch (error) {
        console.error('Error loading reviews:', error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    }

    if (product?.slug) {
      loadReviews();
    }
  }, [product.slug]);

  // Submit review to backend
  const submitReviewToAPI = async (reviewData) => {
    try {
      // Debug logging
      console.log('Submitting review with data:', reviewData);
      console.log('Product object:', product);
      console.log('Backend URL:', process.env.NEXT_PUBLIC_BACKEND_BASE_URL);

      const requestBody = {
        data: {
          name: reviewData.name,
          rating: reviewData.rating,
          tittle: reviewData.title, // Note: keeping 'tittle' to match your backend
          review: reviewData.review,
          verified: reviewData.verified,
          product: product.id || product.documentId || product._id, // Try different ID formats
          helpful: 0,
          notHelpful: 0,
          date: new Date().toISOString() // Add the required date field
        }
      };

      console.log('Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('Success response:', result);
      return { success: true, data: result.data };
    } catch (error) {
      console.error('Error submitting review:', error);
      return { success: false, error: error.message };
    }
  };

  // Update review vote
 // Comprehensive debugging version
const updateReviewVoteAPI = async (reviewId, voteType) => {
  try {
    console.log('=== VOTE UPDATE DEBUG START ===');
    console.log('reviewId parameter:', reviewId);
    console.log('voteType parameter:', voteType);
    console.log('typeof reviewId:', typeof reviewId);
    console.log('reviewId length:', reviewId?.length);
    
    console.log('All reviews in state:', reviews);
    console.log('Reviews count:', reviews.length);
    
    // Log all possible ID fields for each review
    reviews.forEach((review, index) => {
      console.log(`Review ${index}:`, {
        id: review.id,
        documentId: review.documentId,
        _id: review._id,
        title: review.tittle,
        name: review.name
      });
    });
    
    // Find the review using multiple possible ID fields
    let currentReview = reviews.find(r => r.id === reviewId);
    console.log('Found by id:', currentReview);
    
    if (!currentReview) {
      currentReview = reviews.find(r => r.documentId === reviewId);
      console.log('Found by documentId:', currentReview);
    }
    
    if (!currentReview) {
      currentReview = reviews.find(r => r._id === reviewId);
      console.log('Found by _id:', currentReview);
    }
    
    if (!currentReview) {
      console.error('❌ Review not found with any ID field!');
      console.error('Searched for:', reviewId);
      console.error('Available IDs:', reviews.map(r => ({ id: r.id, documentId: r.documentId, _id: r._id })));
      throw new Error(`Review not found with ID: ${reviewId}`);
    }

    console.log('✅ Found review:', currentReview);
    
    // Get the current vote count and increment it
    const currentVoteCount = currentReview[voteType] || 0;
    const updatedVoteCount = currentVoteCount + 1;

    console.log(`Current ${voteType} count:`, currentVoteCount);
    console.log(`Updated ${voteType} count:`, updatedVoteCount);

    const requestBody = {
      data: {
        [voteType]: updatedVoteCount
      }
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    // Try to use the most appropriate ID for the API call
    const apiId = currentReview.documentId || currentReview.id || currentReview._id;
    console.log('Using API ID:', apiId);
    console.log('API ID type:', typeof apiId);

    const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/reviews/${apiId}`;
    console.log('Full API URL:', apiUrl);
    console.log('Backend base URL:', process.env.NEXT_PUBLIC_BACKEND_BASE_URL);

    // First, let's try to GET the review to see if it exists
    console.log('🔍 Testing if review exists with GET request...');
    const testResponse = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('GET test response status:', testResponse.status);
    if (testResponse.ok) {
      const testData = await testResponse.json();
      console.log('✅ Review exists in backend:', testData);
    } else {
      const testError = await testResponse.text();
      console.log('❌ Review does not exist in backend:', testError);
      
      // Try different ID formats
      console.log('🔍 Trying alternative ID formats...');
      
      // Try with just the numeric part if it's a string with prefix
      const numericId = apiId.toString().replace(/\D/g, '');
      if (numericId !== apiId.toString()) {
        console.log('Trying numeric ID:', numericId);
        const numericUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/reviews/${numericId}`;
        const numericTest = await fetch(numericUrl, { method: 'GET' });
        console.log('Numeric ID test status:', numericTest.status);
      }
      
      // List all reviews to see what IDs exist in backend
      console.log('🔍 Fetching all reviews from backend...');
      const allReviewsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/reviews`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (allReviewsResponse.ok) {
        const allReviewsData = await allReviewsResponse.json();
        console.log('All reviews in backend:', allReviewsData);
        console.log('Backend review IDs:', allReviewsData.data?.map(r => ({ id: r.id, documentId: r.documentId })));
      }
      
      return { success: false, error: 'Review not found in backend database' };
    }

    console.log('🚀 Proceeding with PUT request...');
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log('PUT response status:', response.status);
    console.log('PUT response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('PUT request failed:', errorText);
      
      try {
        const errorJson = JSON.parse(errorText);
        console.error('Parsed error:', errorJson);
      } catch (parseError) {
        console.error('Could not parse error as JSON');
      }
      
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Vote update successful:', result);
    
    // Reload reviews to show updated vote counts
    await reloadReviews();
    
    console.log('=== VOTE UPDATE DEBUG END ===');
    return { success: true };
  } catch (error) {
    console.error('❌ Error updating vote:', error);
    return { success: false, error: error.message };
  }
};

// Also add this helper function to inspect what's being passed to the vote buttons
const handleVoteClick = async (review, voteType) => {
  console.log('=== VOTE CLICK DEBUG ===');
  console.log('Review object passed to vote handler:', review);
  console.log('Vote type:', voteType);
  console.log('Review ID being used:', review.id);
  
  const result = await updateReviewVoteAPI(review.id, voteType);
  if (!result.success) {
    console.error('Failed to update vote:', result.error);
    // You might want to show an error message to the user here
  }
};
  // Reload reviews from backend
  const reloadReviews = async () => {
    try {
      const res = await fetchReviewsBySlug(product.slug);
      setReviews(res || []);
    } catch (error) {
      console.error('Error reloading reviews:', error);
    }
  };

  // Calculate review statistics
  const averageRating = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  const totalReviews = reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: totalReviews > 0 ? (reviews.filter(r => r.rating === rating).length / totalReviews) * 100 : 0
  }));

  // Handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (userReview.title && userReview.review && userReview.name) {
      setIsSubmitting(true);
      setSubmitMessage('');
      
      try {
        const result = await submitReviewToAPI({
          name: userReview.name,
          rating: userReview.rating,
          title: userReview.title,
          review: userReview.review,
          verified: userReview.verified
        });
        
        if (result.success) {
          // Reset form and close modal
          setUserReview({ rating: 5, title: '', review: '', name: '', verified: false });
          setShowReviewForm(false);
          setSubmitMessage('Thank you! Your review has been submitted successfully.');
          
          // Reload reviews from backend to get the latest data
          await reloadReviews();
          
          // Clear success message after 3 seconds
          setTimeout(() => setSubmitMessage(''), 3000);
        } else {
          setSubmitMessage(`Failed to submit review: ${result.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error submitting review:', error);
        setSubmitMessage('An error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  const StarRating = ({ rating, size = 'small', interactive = false, onRatingChange }) => {
    const sizeClass = size === 'large' ? 'w-6 h-6' : size === 'medium' ? 'w-5 h-5' : 'w-4 h-4';
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            className={`${sizeClass} ${
              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive ? () => onRatingChange(i + 1) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mt-14">
      <div className="bg-white rounded-3xl shadow-xl p-2">
        {/* Reviews Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
            <p className="text-gray-600">See what our customers are saying about this product</p>
          </div>
          <button
            onClick={() => setShowReviewForm(true)}
            className="mt-4 lg:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
          >
            <FiEdit3 className="w-5 h-5" />
            Write a Review
          </button>
        </div>

        {/* Submit Message */}
        {submitMessage && (
          <div className="mb-6 p-2 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-green-800 font-medium">{submitMessage}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading reviews...</p>
          </div>
        ) : (
          <>
            {/* Review Stats */}
            {reviews.length > 0 && (
              <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Overall Rating */}
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900 mb-2">
                      {averageRating.toFixed(1)}
                    </div>
                    <StarRating rating={Math.floor(averageRating)} size="large" />
                    <p className="text-gray-600 mt-2">Based on {totalReviews} reviews</p>
                  </div>

                  {/* Rating Distribution */}
                  <div className="space-y-2">
                    {ratingDistribution.map(({ rating, count, percentage }) => (
                      <div key={rating} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-12">
                          <span className="text-sm font-medium">{rating}</span>
                          <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-8">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sort Options */}
            {reviews.length > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <FiFilter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Sort by:</span>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                </select>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6 px-4 sm:px-6 lg:px-0">
              {reviews.length === 0 ? (
                <div className="text-center py-16 sm:py-20 px-4 sm:px-0">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <FiStar className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
                  <p className="text-gray-600 mb-6">Be the first to share your thoughts about this product!</p>
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto"
                  >
                    <FiEdit3 className="w-5 h-5" />
                    Write the First Review
                  </button>
                </div>
              ) : (
                sortedReviews.map((review) => (
                  <div key={review.id} className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-2 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {review.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900">{review.name}</h4>
                            {review.verified && (
                              <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                <FiCheckCircle className="w-3 h-3" />
                                Verified Purchase
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <StarRating rating={review.rating} size="small" />
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString('en-GB', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <FiMoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-900 mb-2">{review.tittle}</h5>
                      <p className="text-gray-700 leading-relaxed">{review.review}</p>
                    </div>
                    
                    {/* Helpful Buttons */}
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-600">Was this helpful?</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={async () => {
                            const result = await updateReviewVoteAPI(review.id, 'helpful');
                            if (!result.success) {
                              console.error('Failed to update helpful vote:', result.error);
                            }
                          }}
                          className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
                        >
                          <FiThumbsUp className="w-4 h-4" />
                          <span>Yes</span>
                          {review.helpful > 0 && (
                            <span className="ml-1 text-xs bg-gray-200 rounded-full px-2 py-0.5">
                              {review.helpful}
                            </span>
                          )}
                        </button>
                        <button 
                          onClick={async () => {
                            const result = await updateReviewVoteAPI(review.id, 'notHelpful');
                            if (!result.success) {
                              console.error('Failed to update not helpful vote:', result.error);
                            }
                          }}
                          className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
                        >
                          <FiThumbsDown className="w-4 h-4" />
                          <span>No</span>
                          {review.notHelpful > 0 && (
                            <span className="ml-1 text-xs bg-gray-200 rounded-full px-2 py-0.5">
                              {review.notHelpful}
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Review Form Modal */}
        {showReviewForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Write a Review</h3>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-6">
                {/* Rating Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overall Rating *
                  </label>
                  <StarRating
                    rating={userReview.rating}
                    size="large"
                    interactive={true}
                    onRatingChange={(rating) => setUserReview({...userReview, rating})}
                  />
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={userReview.name}
                    onChange={(e) => setUserReview({...userReview, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                {/* Review Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Title *
                  </label>
                  <input
                    type="text"
                    value={userReview.title}
                    onChange={(e) => setUserReview({...userReview, title: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Summarize your review"
                    required
                  />
                </div>

                {/* Review Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review *
                  </label>
                  <textarea
                    value={userReview.review}
                    onChange={(e) => setUserReview({...userReview, review: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="Share your thoughts about this product..."
                    required
                  />
                </div>

                {/* Verified Purchase Checkbox */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="verified"
                    checked={userReview.verified}
                    onChange={(e) => setUserReview({...userReview, verified: e.target.checked})}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="verified" className="text-sm text-gray-700">
                    This is a verified purchase
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;