import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { register, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const { name, email, password, confirmPassword, phone, address } = formData;

  const onChange = (e) => {
    if (e.target.name.startsWith('address.')) {
      const addressField = e.target.name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: e.target.value
        }
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name) {
      newErrors.name = 'Name is required';
    } else if (name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (phone && !/^\+?[\d\s\-\(\)]+$/.test(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = await register(formData);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-nintendo-blue hover:text-nintendo-red">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      className={`form-input pl-10 ${errors.name ? 'error' : ''}`}
                      placeholder="Enter your full name"
                      value={name}
                      onChange={onChange}
                    />
                  </div>
                  {errors.name && <p className="form-error">{errors.name}</p>}
                </div>

                {/* Email Field */}
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className={`form-input pl-10 ${errors.email ? 'error' : ''}`}
                      placeholder="Enter your email"
                      value={email}
                      onChange={onChange}
                    />
                  </div>
                  {errors.email && <p className="form-error">{errors.email}</p>}
                </div>

                {/* Password Field */}
                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      className={`form-input pl-10 pr-10 ${errors.password ? 'error' : ''}`}
                      placeholder="Create a password"
                      value={password}
                      onChange={onChange}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && <p className="form-error">{errors.password}</p>}
                </div>

                {/* Confirm Password Field */}
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      className={`form-input pl-10 pr-10 ${errors.confirmPassword ? 'error' : ''}`}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={onChange}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
                </div>

                {/* Phone Field */}
                <div className="form-group md:col-span-2">
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      className={`form-input pl-10 ${errors.phone ? 'error' : ''}`}
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={onChange}
                    />
                  </div>
                  {errors.phone && <p className="form-error">{errors.phone}</p>}
                </div>
              </div>

              {/* Address Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin size={20} />
                  Address Information (Optional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group md:col-span-2">
                    <label htmlFor="address.street" className="form-label">
                      Street Address
                    </label>
                    <input
                      id="address.street"
                      name="address.street"
                      type="text"
                      className="form-input"
                      placeholder="Enter street address"
                      value={address.street}
                      onChange={onChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="address.city" className="form-label">
                      City
                    </label>
                    <input
                      id="address.city"
                      name="address.city"
                      type="text"
                      className="form-input"
                      placeholder="Enter city"
                      value={address.city}
                      onChange={onChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="address.state" className="form-label">
                      State/Province
                    </label>
                    <input
                      id="address.state"
                      name="address.state"
                      type="text"
                      className="form-input"
                      placeholder="Enter state/province"
                      value={address.state}
                      onChange={onChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="address.zipCode" className="form-label">
                      ZIP/Postal Code
                    </label>
                    <input
                      id="address.zipCode"
                      name="address.zipCode"
                      type="text"
                      className="form-input"
                      placeholder="Enter ZIP/postal code"
                      value={address.zipCode}
                      onChange={onChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="address.country" className="form-label">
                      Country
                    </label>
                    <input
                      id="address.country"
                      name="address.country"
                      type="text"
                      className="form-input"
                      placeholder="Enter country"
                      value={address.country}
                      onChange={onChange}
                    />
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-nintendo-blue focus:ring-nintendo-blue border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                  I agree to the{' '}
                  <a href="#" className="text-nintendo-blue hover:text-nintendo-red">
                    Terms and Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-nintendo-blue hover:text-nintendo-red">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full btn-lg"
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
