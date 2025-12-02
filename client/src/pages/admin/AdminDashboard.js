import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  Eye,
  Plus,
  Settings
} from 'lucide-react';

const fetchDashboardStats = async () => {
  // This would be a real API endpoint in a production app
  const [productsRes, usersRes] = await Promise.all([
    axios.get('/api/products?limit=1'),
    // axios.get('/api/admin/users?limit=1'), // This endpoint would need to be created
  ]);
  
  return {
    totalProducts: productsRes.data.total || 0,
    totalUsers: 150, // Mock data
    totalOrders: 45, // Mock data
    totalRevenue: 12500 // Mock data
  };
};

const fetchRecentProducts = async () => {
  const { data } = await axios.get('/api/products?limit=5&sort=-createdAt');
  return data.data;
};

const AdminDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useQuery(
    'dashboardStats',
    fetchDashboardStats
  );

  const { data: recentProducts, isLoading: productsLoading } = useQuery(
    'recentProducts',
    fetchRecentProducts
  );

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="card">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change && (
              <p className={`text-sm flex items-center gap-1 ${
                change > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp size={14} />
                {change > 0 ? '+' : ''}{change}% from last month
              </p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon size={24} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/products" className="btn btn-outline">
            <Package size={16} />
            Manage Products
          </Link>
          <Link to="/admin/users" className="btn btn-outline">
            <Users size={16} />
            Manage Users
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="card-body">
                <div className="h-16 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))
        ) : (
          <>
            <StatCard
              title="Total Products"
              value={stats?.totalProducts || 0}
              icon={Package}
              color="bg-nintendo-blue"
              change={12}
            />
            <StatCard
              title="Total Users"
              value={stats?.totalUsers || 0}
              icon={Users}
              color="bg-green-500"
              change={8}
            />
            <StatCard
              title="Total Orders"
              value={stats?.totalOrders || 0}
              icon={ShoppingCart}
              color="bg-yellow-500"
              change={-3}
            />
            <StatCard
              title="Revenue"
              value={`$${(stats?.totalRevenue || 0).toLocaleString()}`}
              icon={DollarSign}
              color="bg-nintendo-red"
              change={15}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Products */}
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Products</h3>
            <Link to="/admin/products" className="btn btn-outline btn-sm">
              <Eye size={14} />
              View All
            </Link>
          </div>
          <div className="card-body">
            {productsLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="w-12 h-12 bg-gray-300 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentProducts?.length > 0 ? (
              <div className="space-y-4">
                {recentProducts.map((product) => (
                  <div key={product._id} className="flex items-center gap-4">
                    <img
                      src={product.images[0] || 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=100&h=100&fit=crop'}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-sm text-gray-600">${product.price} • {product.category}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No products yet</p>
                <Link to="/admin/products" className="btn btn-primary btn-sm mt-4">
                  <Plus size={14} />
                  Add First Product
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 gap-4">
              <Link
                to="/admin/products?action=create"
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-nintendo-blue text-white rounded">
                  <Plus size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Add New Product</h4>
                  <p className="text-sm text-gray-600">Create a new product listing</p>
                </div>
              </Link>

              <Link
                to="/admin/users"
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-green-500 text-white rounded">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Manage Users</h4>
                  <p className="text-sm text-gray-600">View and manage user accounts</p>
                </div>
              </Link>

              <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-yellow-500 text-white rounded">
                  <ShoppingCart size={20} />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">View Orders</h4>
                  <p className="text-sm text-gray-600">Manage customer orders</p>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-gray-500 text-white rounded">
                  <Settings size={20} />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">Store Settings</h4>
                  <p className="text-sm text-gray-600">Configure store preferences</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">New user registered: john.doe@email.com</span>
                <span className="text-gray-400 ml-auto">2 hours ago</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Product updated: Nintendo Switch OLED</span>
                <span className="text-gray-400 ml-auto">4 hours ago</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600">New order received: #12345</span>
                <span className="text-gray-400 ml-auto">6 hours ago</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-gray-600">Product out of stock: Pro Controller</span>
                <span className="text-gray-400 ml-auto">1 day ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
