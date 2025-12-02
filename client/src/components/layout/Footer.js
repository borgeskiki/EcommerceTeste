import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Gamepad2 size={28} className="text-nintendo-red" />
              <span className="text-xl font-bold">Nintendo Store</span>
            </div>
            <p className="text-gray-300 mb-4">
              Your ultimate destination for Nintendo Switch games, consoles, and accessories. 
              Discover the latest releases and classic favorites.
            </p>
            <div className="flex flex-col gap-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>support@nintendostore.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>1-800-NINTENDO</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>123 Gaming Street, Console City, GC 12345</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=Games" className="hover:text-white transition-colors">
                  Games
                </Link>
              </li>
              <li>
                <Link to="/products?category=Consoles" className="hover:text-white transition-colors">
                  Consoles
                </Link>
              </li>
              <li>
                <Link to="/products?category=Accessories" className="hover:text-white transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            © 2024 Nintendo Store. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
