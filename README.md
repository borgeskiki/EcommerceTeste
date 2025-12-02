# Nintendo Switch E-commerce Store

A full-stack e-commerce application built with React, Node.js, Express, and MongoDB, specifically designed for Nintendo Switch products including games, consoles, and accessories.

## 🎮 Features

### User Features
- **User Authentication**: Register, login, and profile management
- **Product Browsing**: Browse products by category, search, and filter
- **Product Details**: Detailed product pages with images, specifications, and reviews
- **Shopping Cart**: Add products to cart (UI ready, backend integration needed)
- **User Reviews**: Rate and review products
- **Responsive Design**: Mobile-friendly interface

### Admin Features
- **Admin Dashboard**: Overview of store statistics and recent activity
- **Product Management**: Full CRUD operations for products
- **User Management**: View and manage user accounts
- **Inventory Tracking**: Monitor stock levels and product status

### Technical Features
- **JWT Authentication**: Secure user authentication and authorization
- **Role-based Access Control**: Admin and user roles with different permissions
- **RESTful API**: Well-structured API endpoints
- **Data Validation**: Input validation on both frontend and backend
- **Error Handling**: Comprehensive error handling and user feedback
- **Modern UI**: Clean, Nintendo-themed design with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern React with hooks
- **React Router**: Client-side routing
- **React Query**: Data fetching and caching
- **React Hook Form**: Form handling and validation
- **Axios**: HTTP client
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Modern icon library
- **React Hot Toast**: Toast notifications

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **Express Validator**: Input validation middleware
- **CORS**: Cross-origin resource sharing

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nintendo-switch-ecommerce
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/nintendo-switch-ecommerce
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=30d
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system.

6. **Seed the database with sample data**
   ```bash
   node scripts/seedData.js
   ```

7. **Start the development servers**
   
   **Backend (Terminal 1):**
   ```bash
   npm run dev
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   npm run client
   ```

8. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 👤 Demo Accounts

After running the seed script, you can use these demo accounts:

### Admin Account
- **Email**: admin@nintendo.com
- **Password**: admin123
- **Access**: Full admin dashboard and product management

### User Account
- **Email**: user@nintendo.com
- **Password**: user123
- **Access**: Standard user features

## 📁 Project Structure

```
nintendo-switch-ecommerce/
├── client/                     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── layout/         # Layout components
│   │   │   └── routing/        # Route protection components
│   │   ├── context/            # React context providers
│   │   ├── pages/              # Page components
│   │   │   └── admin/          # Admin pages
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── config/                     # Configuration files
│   └── database.js
├── controllers/                # Route controllers
│   ├── authController.js
│   └── productController.js
├── middleware/                 # Custom middleware
│   └── auth.js
├── models/                     # Mongoose models
│   ├── User.js
│   └── Product.js
├── routes/                     # API routes
│   ├── auth.js
│   └── products.js
├── scripts/                    # Utility scripts
│   └── seedData.js
├── server.js                   # Express server
├── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user profile
- `GET /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products (with filtering, pagination)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `POST /api/products/:id/reviews` - Add product review

## 🎨 Features in Detail

### Product Catalog
- **Categories**: Games, Consoles, Accessories, Controllers, etc.
- **Search & Filter**: Search by name, filter by category, price, rating
- **Sorting**: Sort by price, name, rating, date added
- **Pagination**: Efficient loading of large product catalogs

### Product Management (Admin)
- **CRUD Operations**: Create, read, update, delete products
- **Image Management**: Multiple product images support
- **Inventory Tracking**: Stock level monitoring
- **Product Status**: Featured products, sale items
- **Specifications**: Detailed product specifications

### User Management
- **Profile Management**: Users can update their information
- **Address Management**: Store shipping addresses
- **Order History**: Track user purchases (ready for implementation)
- **Admin Controls**: Admin can view all users and their activity

## 🔒 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Stateless authentication tokens
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for secure cross-origin requests
- **Role-based Access**: Admin and user role separation

## 🚧 Future Enhancements

- **Shopping Cart Backend**: Complete cart functionality with persistence
- **Payment Integration**: Stripe/PayPal payment processing
- **Order Management**: Complete order lifecycle management
- **Email Notifications**: Order confirmations and updates
- **Product Recommendations**: AI-based product suggestions
- **Inventory Alerts**: Low stock notifications
- **Advanced Analytics**: Sales reports and user analytics
- **Image Upload**: Direct image upload instead of URLs
- **Wishlist**: Save products for later
- **Product Variants**: Size, color variations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Nintendo for the amazing Switch console and games
- React team for the excellent framework
- MongoDB team for the flexible database
- All the open-source contributors whose packages made this project possible

## 📞 Support

If you have any questions or need help with the project, please open an issue on GitHub.

---

**Happy Gaming! 🎮**
