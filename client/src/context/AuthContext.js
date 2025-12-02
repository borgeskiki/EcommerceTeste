import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null
      };
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null
      };
    case 'LOAD_USER':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload
      };
    default:
      return state;
  }
};

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  user: null,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set auth token
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  // Load user
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
      try {
        const res = await axios.get('/api/auth/me');
        dispatch({
          type: 'LOAD_USER',
          payload: res.data.data
        });
      } catch (error) {
        dispatch({
          type: 'AUTH_ERROR',
          payload: error.response?.data?.message || 'Authentication failed'
        });
        setAuthToken(null);
      }
    } else {
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  // Register user
  const register = async (formData) => {
    dispatch({ type: 'REGISTER_START' });
    
    try {
      const res = await axios.post('/api/auth/register', formData);
      
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: {
          token: res.data.token,
          user: res.data.data
        }
      });
      
      setAuthToken(res.data.token);
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({
        type: 'REGISTER_FAIL',
        payload: message
      });
      toast.error(message);
      setAuthToken(null);
      return { success: false, message };
    }
  };

  // Login user
  const login = async (formData) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const res = await axios.post('/api/auth/login', formData);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token: res.data.token,
          user: res.data.data
        }
      });
      
      setAuthToken(res.data.token);
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({
        type: 'LOGIN_FAIL',
        payload: message
      });
      toast.error(message);
      setAuthToken(null);
      return { success: false, message };
    }
  };

  // Logout
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    setAuthToken(null);
    toast.success('Logged out successfully');
  };

  // Update user details
  const updateUser = async (formData) => {
    try {
      const res = await axios.put('/api/auth/updatedetails', formData);
      dispatch({
        type: 'LOAD_USER',
        payload: res.data.data
      });
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
        login,
        logout,
        loadUser,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
