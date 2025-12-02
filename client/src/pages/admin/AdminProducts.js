import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Filter,
  Eye,
  Star,
  Package,
  X
} from 'lucide-react';

const fetchProducts = async (params) => {
  const queryString = new URLSearchParams(params).toString();
  const { data } = await axios.get(`/api/products?${queryString}`);
  return data;
};

const deleteProduct = async (id) => {
  await axios.delete(`/api/products/${id}`);
};

const AdminProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showCreateForm, setShowCreateForm] = useState(searchParams.get('action') === 'create');
  const [editingProduct, setEditingProduct] = useState(null);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || '-createdAt',
    page: searchParams.get('page') || '1',
    limit: '10'
  });

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery(
    ['adminProducts', filters],
    () => fetchProducts(filters),
    { keepPreviousData: true }
  );

  const deleteMutation = useMutation(deleteProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries('adminProducts');
      toast.success('Product deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  });

  const handleDelete = (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      deleteMutation.mutate(product._id);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: '1' };
    setFilters(newFilters);
    
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v !== '') params.set(k, v);
    });
    setSearchParams(params);
  };

  const ProductForm = ({ product, onClose }) => {
    const [formData, setFormData] = useState({
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || '',
      originalPrice: product?.originalPrice || '',
      category: product?.category || 'Games',
      brand: product?.brand || 'Nintendo',
      images: product?.images || [''],
      stock: product?.stock || 0,
      featured: product?.featured || false,
      onSale: product?.onSale || false,
      tags: product?.tags?.join(', ') || '',
      specifications: product?.specifications ? Object.entries(product.specifications).map(([k, v]) => `${k}: ${v}`).join('\n') : ''
    });

    const createMutation = useMutation(
      (data) => axios.post('/api/products', data),
      {
        onSuccess: () => {
          queryClient.invalidateQueries('adminProducts');
          toast.success('Product created successfully');
          onClose();
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || 'Failed to create product');
        }
      }
    );

    const updateMutation = useMutation(
      (data) => axios.put(`/api/products/${product._id}`, data),
      {
        onSuccess: () => {
          queryClient.invalidateQueries('adminProducts');
          toast.success('Product updated successfully');
          onClose();
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || 'Failed to update product');
        }
      }
    );

    const handleSubmit = (e) => {
      e.preventDefault();
      
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        stock: parseInt(formData.stock),
        images: formData.images.filter(img => img.trim() !== ''),
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : [],
        specifications: formData.specifications ? 
          Object.fromEntries(
            formData.specifications.split('\n')
              .filter(line => line.includes(':'))
              .map(line => {
                const [key, ...valueParts] = line.split(':');
                return [key.trim(), valueParts.join(':').trim()];
              })
          ) : {}
      };

      if (product) {
        updateMutation.mutate(submitData);
      } else {
        createMutation.mutate(submitData);
      }
    };

    const handleImageChange = (index, value) => {
      const newImages = [...formData.images];
      newImages[index] = value;
      setFormData({ ...formData, images: newImages });
    };

    const addImageField = () => {
      setFormData({ ...formData, images: [...formData.images, ''] });
    };

    const removeImageField = (index) => {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData({ ...formData, images: newImages });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {product ? 'Edit Product' : 'Create New Product'}
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="Games">Games</option>
                  <option value="Consoles">Consoles</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Controllers">Controllers</option>
                  <option value="Cases & Protection">Cases & Protection</option>
                  <option value="Memory & Storage">Memory & Storage</option>
                  <option value="Cables & Adapters">Cables & Adapters</option>
                  <option value="Stands & Grips">Stands & Grips</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Price *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Original Price</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Brand</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Stock Quantity *</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                className="form-input form-textarea"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Product Images *</label>
              {formData.images.map((image, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="url"
                    className="form-input flex-1"
                    placeholder="Enter image URL"
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    required={index === 0}
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="btn btn-outline btn-sm"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addImageField}
                className="btn btn-outline btn-sm"
              >
                <Plus size={16} />
                Add Image
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Tags (comma-separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="gaming, nintendo, switch"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Specifications (key: value per line)</label>
              <textarea
                className="form-input form-textarea"
                rows={4}
                placeholder="Platform: Nintendo Switch&#10;Genre: Action&#10;Rating: E for Everyone"
                value={formData.specifications}
                onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
              />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                Featured Product
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={formData.onSale}
                  onChange={(e) => setFormData({ ...formData, onSale: e.target.checked })}
                />
                On Sale
              </label>
            </div>

            <div className="flex gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={createMutation.isLoading || updateMutation.isLoading}
                className="btn btn-primary"
              >
                {createMutation.isLoading || updateMutation.isLoading ? (
                  <>
                    <div className="spinner"></div>
                    {product ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  product ? 'Update Product' : 'Create Product'
                )}
              </button>
              <button type="button" onClick={onClose} className="btn btn-outline">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <select
            className="form-select"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Games">Games</option>
            <option value="Consoles">Consoles</option>
            <option value="Accessories">Accessories</option>
            <option value="Controllers">Controllers</option>
            <option value="Cases & Protection">Cases & Protection</option>
            <option value="Memory & Storage">Memory & Storage</option>
            <option value="Cables & Adapters">Cables & Adapters</option>
            <option value="Stands & Grips">Stands & Grips</option>
          </select>

          <select
            className="form-select"
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
          >
            <option value="-createdAt">Newest First</option>
            <option value="createdAt">Oldest First</option>
            <option value="name">Name A-Z</option>
            <option value="-name">Name Z-A</option>
            <option value="price">Price Low to High</option>
            <option value="-price">Price High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="card">
        <div className="card-body p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="spinner mx-auto mb-4"></div>
              <p>Loading products...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">
              <p>Error loading products. Please try again.</p>
            </div>
          ) : data?.data?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.data.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={product.images[0] || 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=100&h=100&fit=crop'}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.brand}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          ${product.price}
                          {product.originalPrice && product.originalPrice > product.price && (
                            <div className="text-xs text-gray-500 line-through">
                              ${product.originalPrice}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${
                          product.stock > 10 ? 'bg-green-100 text-green-800' :
                          product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {product.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Star className="text-yellow-400 fill-current" size={16} />
                          <span className="ml-1">{product.rating.toFixed(1)}</span>
                          <span className="text-gray-500 ml-1">({product.numReviews})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-1">
                          {product.featured && (
                            <span className="px-2 py-1 text-xs font-semibold bg-nintendo-blue text-white rounded">
                              Featured
                            </span>
                          )}
                          {product.onSale && (
                            <span className="px-2 py-1 text-xs font-semibold bg-nintendo-red text-white rounded">
                              Sale
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => window.open(`/products/${product._id}`, '_blank')}
                            className="text-gray-400 hover:text-gray-600"
                            title="View Product"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="text-nintendo-blue hover:text-nintendo-red"
                            title="Edit Product"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete Product"
                            disabled={deleteMutation.isLoading}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first product</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn btn-primary"
              >
                <Plus size={16} />
                Add Product
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {data?.pagination && (
        <div className="mt-6 flex justify-center">
          <div className="flex gap-2">
            {data.pagination.prev && (
              <button
                onClick={() => handleFilterChange('page', data.pagination.prev.page.toString())}
                className="btn btn-outline"
              >
                Previous
              </button>
            )}
            
            <span className="flex items-center px-4 py-2 text-gray-700">
              Page {filters.page} of {Math.ceil(data.total / parseInt(filters.limit))}
            </span>
            
            {data.pagination.next && (
              <button
                onClick={() => handleFilterChange('page', data.pagination.next.page.toString())}
                className="btn btn-outline"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {(showCreateForm || editingProduct) && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setShowCreateForm(false);
            setEditingProduct(null);
            // Remove action from URL
            const params = new URLSearchParams(searchParams);
            params.delete('action');
            setSearchParams(params);
          }}
        />
      )}
    </div>
  );
};

export default AdminProducts;
