import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const fetchProduct = async (id) => {
  const { data } = await axios.get(`/api/products/${id}`);
  return data.data;
};

const ProductDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { data: product, isLoading, error } = useQuery(
    ['product', id],
    () => fetchProduct(id)
  );

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  const addToCart = () => {
    // Cart functionality would be implemented here
    console.log('Adding to cart:', { product: product._id, quantity });
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-gray-300 h-96 rounded"></div>
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-300 h-20 w-20 rounded"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              <div className="h-32 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link to="/products" className="btn btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-nintendo-blue">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-nintendo-blue">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-nintendo-blue">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.images[selectedImage] || 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop'}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
            {product.onSale && (
              <span className="absolute top-4 left-4 bg-nintendo-red text-white px-3 py-1 text-sm font-semibold rounded">
                SALE
              </span>
            )}
            {product.featured && (
              <span className="absolute top-4 right-4 bg-nintendo-blue text-white px-3 py-1 text-sm font-semibold rounded">
                FEATURED
              </span>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-nintendo-blue' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title and Rating */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={`${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating.toFixed(1)} ({product.numReviews} reviews)
                </span>
              </div>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {product.category}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
            )}
            {product.onSale && (
              <span className="bg-nintendo-red text-white px-2 py-1 text-sm font-semibold rounded">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Specifications</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <dl className="grid grid-cols-1 gap-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <dt className="font-medium text-gray-700 capitalize">{key}:</dt>
                      <dd className="text-gray-600">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Availability:</span>
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium">
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-red-600 font-medium">Out of Stock</span>
            )}
          </div>

          {/* Quantity and Add to Cart */}
          {product.stock > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={addToCart}
                  className="btn btn-primary flex-1"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                <button className="btn btn-outline">
                  <Heart size={20} />
                </button>
                <button className="btn btn-outline">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Truck size={16} className="text-nintendo-blue" />
              <span>Free shipping over $50</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield size={16} className="text-nintendo-blue" />
              <span>1 year warranty</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <RefreshCw size={16} className="text-nintendo-blue" />
              <span>30-day returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Customer Reviews ({product.numReviews})
          </h2>
          {isAuthenticated && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="btn btn-outline"
            >
              Write a Review
            </button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && isAuthenticated && (
          <div className="card mb-8">
            <div className="card-body">
              <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
              <form className="space-y-4">
                <div>
                  <label className="form-label">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        className="text-gray-300 hover:text-yellow-400"
                      >
                        <Star size={24} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="form-label">Comment</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="Share your experience with this product..."
                    rows={4}
                  ></textarea>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    Submit Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review) => (
              <div key={review._id} className="card">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.name}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={`${
                              i < review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
