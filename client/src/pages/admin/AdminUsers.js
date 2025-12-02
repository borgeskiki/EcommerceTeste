import React, { useState } from 'react';
import { Search, Filter, Users, Crown, User, Mail, Calendar, MoreVertical } from 'lucide-react';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Mock data - in a real app, this would come from an API
  const users = [
    {
      _id: '1',
      name: 'John Doe',
      email: 'john.doe@email.com',
      role: 'user',
      createdAt: '2024-01-15T10:30:00Z',
      lastLogin: '2024-01-20T14:22:00Z',
      status: 'active'
    },
    {
      _id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      role: 'user',
      createdAt: '2024-01-10T09:15:00Z',
      lastLogin: '2024-01-19T16:45:00Z',
      status: 'active'
    },
    {
      _id: '3',
      name: 'Admin User',
      email: 'admin@nintendo.com',
      role: 'admin',
      createdAt: '2023-12-01T08:00:00Z',
      lastLogin: '2024-01-21T10:00:00Z',
      status: 'active'
    },
    {
      _id: '4',
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      role: 'user',
      createdAt: '2024-01-05T11:20:00Z',
      lastLogin: '2024-01-18T13:30:00Z',
      status: 'inactive'
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === '' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserStats = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const adminUsers = users.filter(u => u.role === 'admin').length;
    const newUsersThisMonth = users.filter(u => {
      const userDate = new Date(u.createdAt);
      const now = new Date();
      return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
    }).length;

    return { totalUsers, activeUsers, adminUsers, newUsersThisMonth };
  };

  const stats = getUserStats();

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="card">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
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
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="bg-nintendo-blue"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon={User}
          color="bg-green-500"
        />
        <StatCard
          title="Administrators"
          value={stats.adminUsers}
          icon={Crown}
          color="bg-nintendo-red"
        />
        <StatCard
          title="New This Month"
          value={stats.newUsersThisMonth}
          icon={Calendar}
          color="bg-yellow-500"
        />
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-nintendo-blue"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="form-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="card-body p-0">
          {filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-nintendo-blue flex items-center justify-center text-white font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail size={14} className="mr-1" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded capitalize ${
                          user.role === 'admin' 
                            ? 'bg-nintendo-red text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role === 'admin' && <Crown size={12} className="inline mr-1" />}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded capitalize ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDateTime(user.lastLogin)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">No users match your current search criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* User Activity */}
      <div className="mt-8">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Recent User Activity</h3>
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
                <span className="text-gray-600">User login: jane.smith@email.com</span>
                <span className="text-gray-400 ml-auto">4 hours ago</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600">Profile updated: mike.johnson@email.com</span>
                <span className="text-gray-400 ml-auto">6 hours ago</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">New user registered: sarah.wilson@email.com</span>
                <span className="text-gray-400 ml-auto">1 day ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
