import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { 
  Filter, 
  Search, 
  Star, 
  Grid, 
  List,
  ChevronDown,
  X
} from 'lucide-react';

const fetchProducts = async (params) => {
  const queryString = new URLSearchParams(params).toString();
  const { data } = await axios.get(`/api/products?${queryString}`);
  return data;
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
    inStock: searchParams.get('inStock') || '',
    featured: searchParams.get('featured') || '',
    onSale: searchParams.get('onSale') || '',
    sort: searchParams.get('sort') || '-createdAt',
    page: searchParams.get('page') || '1',
    limit: '12'
  });

  const { data, isLoading, error } = useQuery(
    ['products', filters],
    () => fetchProducts(filters),
    { keepPreviousData: true }
  );

  const categories = [
    'Games',
    'Consoles',
    'Accessories',
    'Controllers',
    'Cases & Protection',
    'Memory & Storage',
    'Cables & Adapters',
    'Stands & Grips'
  ];

  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: 'name', label: 'Name A-Z' },
    { value: '-name', label: 'Name Z-A' },
    { value: 'price', label: 'Price Low to High' },
    { value: '-price', label: 'Price High to Low' },
    { value: '-rating', label: 'Highest Rated' },
    { value: '-numReviews', label: 'Most Reviews' }
  ];

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: '1' // Reset to first page when filters change
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      inStock: '',
      featured: '',
      onSale: '',
      sort: '-createdAt',
      page: '1',
      limit: '12'
    });
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage.toString() }));
  };

  const ProductCard = ({ product }) => (
    <Link 
      to={`/products/${product._id}`} 
      className={`card hover:shadow-lg transition-shadow ${viewMode === 'list' ? 'flex flex-row' : ''}`}
    >
      <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=200&fit=crop'}
          alt={product.name}
          className={`object-cover ${viewMode === 'list' ? 'w-full h-full' : 'w-full h-48'}`}
        />
        {product.onSale && (
          <span className="absolute top-2 left-2 bg-nintendo-red text-white px-2 py-1 text-xs font-semibold rounded">
            SALE
          </span>
        )}
        {product.featured && (
          <span className="absolute top-2 right-2 bg-nintendo-blue text-white px-2 py-1 text-xs font-semibold rounded">
            FEATURED
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="card-body flex-1">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        {viewMode === 'list' && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        )}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            <Star className="text-yellow-400 fill-current" size={16} />
            <span className="text-sm text-gray-600 ml-1">
              {product.rating.toFixed(1)} ({product.numReviews})
            </span>
          </div>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>
    </Link>
  );

  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Products</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Products</h1>
        <p className="text-gray-600">
          Discover our complete collection of Nintendo Switch products
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-nintendo-blue"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>

          {/* Sort */}
          <div className="w-full lg:w-48">
            <select
              className="form-select w-full"
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-nintendo-blue text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-nintendo-blue text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              <List size={20} />
            </button>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-outline flex items-center gap-2"
          >
            <Filter size={16} />
            Filters
            <ChevronDown size={16} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  className="form-select w-full"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="form-input w-full"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="form-input w-full"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                <select
                  className="form-select w-full"
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', e.target.value)}
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="1">1+ Stars</option>
                </select>
              </div>

              {/* Other Filters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Other Filters</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={filters.inStock === 'true'}
                      onChange={(e) => handleFilterChange('inStock', e.target.checked ? 'true' : '')}
                    />
                    In Stock Only
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={filters.featured === 'true'}
                      onChange={(e) => handleFilterChange('featured', e.target.checked ? 'true' : '')}
                    />
                    Featured Products
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={filters.onSale === 'true'}
                      onChange={(e) => handleFilterChange('onSale', e.target.checked ? 'true' : '')}
                    />
                    On Sale
                  </label>
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="btn btn-outline btn-sm flex items-center gap-2"
              >
                <X size={16} />
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-6">
        <p className="text-gray-600">
          {isLoading ? 'Loading...' : `Showing ${data?.count || 0} of ${data?.total || 0} products`}
        </p>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {[...Array(12)].map((_, i) => (
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
      ) : data?.data?.length > 0 ? (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {data.data.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">No products found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
          <button onClick={clearFilters} className="btn btn-primary">
            Clear Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {data?.pagination && (
        <div className="mt-12 flex justify-center">
          <div className="flex gap-2">
            {data.pagination.prev && (
              <button
                onClick={() => handlePageChange(data.pagination.prev.page)}
                className="btn btn-outline"
              >
                Previous
              </button>
            )}
            
            <span className="flex items-center px-4 py-2 text-gray-700">
              Page {filters.page}
            </span>
            
            {data.pagination.next && (
              <button
                onClick={() => handlePageChange(data.pagination.next.page)}
                className="btn btn-outline"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
