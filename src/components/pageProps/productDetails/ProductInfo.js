import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/orebiSlice";

const ProductInfo = ({ productInfo }) => {
  const dispatch = useDispatch();

  // State to manage the review input and reviews
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);

  // Load existing reviews from localStorage
  useEffect(() => {
    const savedReviews = JSON.parse(localStorage.getItem("reviews")) || [];
    setReviews(savedReviews);
  }, []);

  // Handle review submission
  const handleAddReview = () => {
    if (review.trim()) {
      const newReviews = [...reviews, { text: review, id: Date.now() }];
      setReviews(newReviews);
      localStorage.setItem("reviews", JSON.stringify(newReviews));
      setReview(""); // Clear review input
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 border border-gray-200 rounded-lg shadow-lg bg-white">
      {/* Product Name */}
      <h2 className="text-4xl font-semibold text-gray-800">{productInfo.productName}</h2>
      
      {/* Price */}
      <p className="text-2xl font-bold text-primeColor">Rs. {productInfo.price}</p>
      
      {/* Description */}
      <p className="text-base text-gray-600 leading-relaxed">{productInfo.des}</p>
      
      {/* Reviews Placeholder */}
      <p className="text-sm italic text-gray-500">Be the first to leave a review!</p>
      
      {/* Colors */}
      <div className="flex items-center gap-2">
        <span className="font-medium text-lg text-gray-700">Colors:</span>
        <span className="text-sm text-gray-600 px-3 py-1 bg-gray-100 rounded-full">{productInfo.color}</span>
      </div>
      
      {/* Add to Cart Button */}
      <button
        onClick={() =>
          dispatch(
            addToCart({
              _id: productInfo.id,
              name: productInfo.productName,
              quantity: 1,
              image: productInfo.img,
              badge: productInfo.badge,
              price: productInfo.price,
              colors: productInfo.color,
            })
          )
        }
        className="w-full py-4 bg-primeColor hover:bg-black duration-300 text-white text-lg font-semibold rounded-lg shadow-md"
      >
        Add to Cart
      </button>
      
      {/* Review Section */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-700">Leave a Review</h3>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="w-full p-4 mt-2 border border-gray-300 rounded-md"
          rows="4"
          placeholder="Write your review here..."
        ></textarea>
        <button
          onClick={handleAddReview}
          className="w-full py-4 mt-4 bg-primeColor text-white text-lg font-semibold rounded-lg shadow-md hover:bg-black duration-300"
        >
          Submit Review
        </button>
      </div>
      
      {/* Display Reviews */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-gray-700">Reviews</h4>
        {reviews.length === 0 ? (
          <p className="text-sm text-gray-500">No reviews yet.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {reviews.map((review) => (
              <li key={review.id} className="bg-gray-50 p-4 border border-gray-200 rounded-md">
                <p className="text-base text-gray-700">{review.text}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Optional Placeholder for Policies/Info */}
      <p className="text-sm text-gray-500 mt-4">
        Free shipping on orders above Rs. 1,000. <br />
        Hassle-free returns within 30 days.
      </p>
    </div>
  );
};

export default ProductInfo;
