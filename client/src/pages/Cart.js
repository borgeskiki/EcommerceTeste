import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';

const Cart = () => {
  // This would typically come from a cart context or state management
  const cartItems = [];

  const EmptyCart = () => (
    <div className="container py-16">
      <div className="max-w-md mx-auto text-center">
        <ShoppingCart size={64} className="mx-auto text-gray-400 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">
          Looks like you haven't added any items to your cart yet. 
          Start shopping to fill it up!
        </p>
        <Link to="/products" className="btn btn-primary">
          <ArrowLeft size={16} />
          Continue Shopping
        </Link>
      </div>
    </div>
  );

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/products" className="btn btn-outline">
          <ArrowLeft size={16} />
          Continue Shopping
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Cart items would be rendered here */}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-8">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Order Summary</h3>
            </div>
            <div className="card-body space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>$0.00</span>
                </div>
              </div>
              <button className="btn btn-primary w-full">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
