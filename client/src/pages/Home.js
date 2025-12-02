import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { 
  ShoppingBag, 
  Star, 
  TrendingUp, 
  Shield, 
  Truck, 
  RefreshCw,
  ArrowRight,
  Gamepad2
} from 'lucide-react';

const fetchFeaturedProducts = async () => {
  const { data } = await axios.get('/api/products?featured=true&limit=8');
  return data.data;
};

const fetchLatestProducts = async () => {
  const { data } = await axios.get('/api/products?limit=8&sort=-createdAt');
  return data.data;
};

const Home = () => {
  const { data: featuredProducts, isLoading: featuredLoading } = useQuery(
    'featuredProducts',
    fetchFeaturedProducts
  );

  const { data: latestProducts, isLoading: latestLoading } = useQuery(
    'latestProducts',
    fetchLatestProducts
  );

  const categories = [
    {
      name: 'Games',
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop',
      description: 'Latest Nintendo Switch games'
    },
    {
      name: 'Consoles',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      description: 'Nintendo Switch consoles and bundles'
    },
    {
      name: 'Accessories',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
      description: 'Controllers, cases, and more'
    },
    {
      name: 'Controllers',
      image: 'https://images.unsplash.com/photo-1592840062661-eb5ad9b3d1c6?w=400&h=300&fit=crop',
      description: 'Pro controllers and Joy-Cons'
    }
  ];

  const features = [
    {
      icon: <Shield className="text-nintendo-blue" size={24} />,
      title: 'Secure Shopping',
      description: 'Your payment information is always protected'
    },
    {
      icon: <Truck className="text-nintendo-blue" size={24} />,
      title: 'Fast Shipping',
      description: 'Free shipping on orders over $50'
    },
    {
      icon: <RefreshCw className="text-nintendo-blue" size={24} />,
      title: 'Easy Returns',
      description: '30-day return policy on all items'
    }
  ];

  const ProductCard = ({ product }) => (
    <Link to={`/products/${product._id}`} className="card hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=200&fit=crop'}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.onSale && (
          <span className="absolute top-2 left-2 bg-nintendo-red text-white px-2 py-1 text-xs font-semibold rounded">
            SALE
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="card-body">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            <Star className="text-yellow-400 fill-current" size={16} />
            <span className="text-sm text-gray-600 ml-1">
              {product.rating.toFixed(1)} ({product.numReviews})
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>
          <span className="text-xs text-gray-500">{product.category}</span>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-nintendo-blue to-nintendo-red text-white py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to Nintendo Store
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Discover the latest Nintendo Switch games, consoles, and accessories. 
              Your gaming adventure starts here!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products" className="btn bg-white text-nintendo-blue hover:bg-gray-100 btn-lg">
                <ShoppingBag size={20} />
                Shop Now
              </Link>
              <Link to="/products?featured=true" className="btn btn-outline border-white text-white hover:bg-white hover:text-nintendo-blue btn-lg">
                <TrendingUp size={20} />
                Featured Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find exactly what you're looking for in our carefully curated categories
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${category.name}`}
                className="group card hover:shadow-lg transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
              <p className="text-gray-600">Hand-picked favorites from our collection</p>
            </div>
            <Link to="/products?featured=true" className="btn btn-outline">
              View All
              <ArrowRight size={16} />
            </Link>
          </div>

          {featuredLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="bg-gray-300 h-48"></div>
                  <div className="card-body">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts?.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest Products */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Arrivals</h2>
              <p className="text-gray-600">Check out our newest additions</p>
            </div>
            <Link to="/products?sort=-createdAt" className="btn btn-outline">
              View All
              <ArrowRight size={16} />
            </Link>
          </div>

          {latestLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="bg-gray-300 h-48"></div>
                  <div className="card-body">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestProducts?.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Nintendo Store?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best gaming experience with top-quality products and service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-nintendo-red text-white">
        <div className="container text-center">
          <Gamepad2 className="mx-auto mb-6 text-white" size={48} />
          <h2 className="text-3xl font-bold mb-4">Ready to Start Gaming?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of gamers who trust Nintendo Store for their gaming needs. 
            Browse our collection and find your next favorite game today!
          </p>
          <Link to="/products" className="btn bg-white text-nintendo-red hover:bg-gray-100 btn-lg">
            <ShoppingBag size={20} />
            Start Shopping
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
