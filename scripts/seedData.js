const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Product = require('../models/Product');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nintendo-switch-ecommerce');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Sample users
const users = [
  {
    name: 'Admin User',
    email: 'admin@nintendo.com',
    password: 'admin123',
    role: 'admin',
    phone: '+1-555-0101',
    address: {
      street: '123 Nintendo Way',
      city: 'Redmond',
      state: 'WA',
      zipCode: '98052',
      country: 'USA'
    }
  },
  {
    name: 'John Doe',
    email: 'user@nintendo.com',
    password: 'user123',
    role: 'user',
    phone: '+1-555-0102',
    address: {
      street: '456 Gamer Street',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA'
    }
  }
];

// Sample products
const products = [
  {
    name: 'Nintendo Switch OLED Model',
    description: 'Meet the newest member of the Nintendo Switch family. The Nintendo Switch OLED model features a vibrant 7-inch OLED screen, a wide adjustable stand, a dock with a wired LAN port, 64 GB of internal storage, and enhanced audio.',
    price: 349.99,
    category: 'Consoles',
    brand: 'Nintendo',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop'
    ],
    stock: 25,
    featured: true,
    onSale: false,
    tags: ['console', 'oled', 'nintendo', 'switch'],
    specifications: {
      'Screen Size': '7-inch OLED',
      'Storage': '64 GB',
      'Battery Life': 'Up to 9 hours',
      'Connectivity': 'Wi-Fi, Bluetooth'
    }
  },
  {
    name: 'The Legend of Zelda: Breath of the Wild',
    description: 'Step into a world of discovery, exploration, and adventure in The Legend of Zelda: Breath of the Wild. Travel across vast fields, through forests, and to mountain peaks as you discover what has become of the kingdom of Hyrule.',
    price: 59.99,
    originalPrice: 69.99,
    category: 'Games',
    brand: 'Nintendo',
    images: [
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop'
    ],
    stock: 50,
    featured: true,
    onSale: true,
    tags: ['zelda', 'adventure', 'open-world', 'nintendo'],
    specifications: {
      'Platform': 'Nintendo Switch',
      'Genre': 'Action-Adventure',
      'Rating': 'E10+ (Everyone 10+)',
      'Players': '1'
    }
  },
  {
    name: 'Super Mario Odyssey',
    description: 'Join Mario on a massive, globe-trotting 3D adventure and use his incredible new abilities to collect Moons so you can power up your airship, the Odyssey, and rescue Princess Peach from Bowser\'s wedding plans!',
    price: 49.99,
    originalPrice: 59.99,
    category: 'Games',
    brand: 'Nintendo',
    images: [
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop'
    ],
    stock: 35,
    featured: true,
    onSale: true,
    tags: ['mario', 'platformer', '3d', 'nintendo'],
    specifications: {
      'Platform': 'Nintendo Switch',
      'Genre': '3D Platformer',
      'Rating': 'E10+ (Everyone 10+)',
      'Players': '1-2'
    }
  },
  {
    name: 'Nintendo Switch Pro Controller',
    description: 'Take your game sessions up a notch with the Nintendo Switch Pro Controller. Includes motion controls, HD rumble, built-in amiibo functionality, and more.',
    price: 69.99,
    category: 'Controllers',
    brand: 'Nintendo',
    images: [
      'https://images.unsplash.com/photo-1592840062661-eb5ad9b3d1c6?w=600&h=600&fit=crop'
    ],
    stock: 40,
    featured: false,
    onSale: false,
    tags: ['controller', 'pro', 'wireless', 'nintendo'],
    specifications: {
      'Connectivity': 'Wireless/USB-C',
      'Battery Life': 'Approximately 40 hours',
      'Features': 'HD Rumble, Motion Controls, amiibo',
      'Compatibility': 'Nintendo Switch'
    }
  },
  {
    name: 'Animal Crossing: New Horizons',
    description: 'Escape to a deserted island and create your own paradise as you explore, create, and customize in the Animal Crossing: New Horizons game.',
    price: 54.99,
    category: 'Games',
    brand: 'Nintendo',
    images: [
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop'
    ],
    stock: 30,
    featured: false,
    onSale: false,
    tags: ['animal-crossing', 'simulation', 'social', 'nintendo'],
    specifications: {
      'Platform': 'Nintendo Switch',
      'Genre': 'Social Simulation',
      'Rating': 'E (Everyone)',
      'Players': '1-8'
    }
  },
  {
    name: 'Mario Kart 8 Deluxe',
    description: 'Hit the road with the definitive version of Mario Kart 8 and play anytime, anywhere! Race your friends or battle them in a revised battle mode on new and returning battle courses.',
    price: 59.99,
    category: 'Games',
    brand: 'Nintendo',
    images: [
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop'
    ],
    stock: 45,
    featured: true,
    onSale: false,
    tags: ['mario-kart', 'racing', 'multiplayer', 'nintendo'],
    specifications: {
      'Platform': 'Nintendo Switch',
      'Genre': 'Racing',
      'Rating': 'E (Everyone)',
      'Players': '1-4 (local), 1-12 (online)'
    }
  },
  {
    name: 'Nintendo Switch Carrying Case',
    description: 'Protect your Nintendo Switch system with this sleek carrying case. Features a hard shell exterior and soft interior lining to keep your console safe during travel.',
    price: 19.99,
    category: 'Cases & Protection',
    brand: 'Nintendo',
    images: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=600&fit=crop'
    ],
    stock: 60,
    featured: false,
    onSale: false,
    tags: ['case', 'protection', 'travel', 'nintendo'],
    specifications: {
      'Material': 'Hard shell exterior, soft interior',
      'Compatibility': 'Nintendo Switch',
      'Storage': 'Game card slots',
      'Dimensions': '10.5" x 5.1" x 2.8"'
    }
  },
  {
    name: 'SanDisk 128GB microSDXC Card for Nintendo Switch',
    description: 'Officially licensed for the Nintendo Switch system. Add up to 128GB of storage space instantly. Transfer rates up to 100MB/s to reduce game loading time.',
    price: 24.99,
    originalPrice: 29.99,
    category: 'Memory & Storage',
    brand: 'SanDisk',
    images: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=600&fit=crop'
    ],
    stock: 75,
    featured: false,
    onSale: true,
    tags: ['microsd', 'storage', 'memory', 'sandisk'],
    specifications: {
      'Capacity': '128GB',
      'Speed Class': 'U3, V30',
      'Transfer Rate': 'Up to 100MB/s read',
      'Compatibility': 'Nintendo Switch'
    }
  },
  {
    name: 'Super Smash Bros. Ultimate',
    description: 'The biggest crossover in Super Smash Bros. history is here! Fighters from across the Nintendo universe and beyond face off in the ultimate showdown.',
    price: 59.99,
    category: 'Games',
    brand: 'Nintendo',
    images: [
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop'
    ],
    stock: 40,
    featured: true,
    onSale: false,
    tags: ['smash-bros', 'fighting', 'multiplayer', 'nintendo'],
    specifications: {
      'Platform': 'Nintendo Switch',
      'Genre': 'Fighting',
      'Rating': 'E10+ (Everyone 10+)',
      'Players': '1-8'
    }
  },
  {
    name: 'Joy-Con (L/R) - Neon Red/Neon Blue',
    description: 'Bring the full Joy-Con experience to your games with this set of left and right Joy-Con controllers. Each Joy-Con has a full set of buttons and can act as a standalone controller.',
    price: 79.99,
    category: 'Controllers',
    brand: 'Nintendo',
    images: [
      'https://images.unsplash.com/photo-1592840062661-eb5ad9b3d1c6?w=600&h=600&fit=crop'
    ],
    stock: 35,
    featured: false,
    onSale: false,
    tags: ['joy-con', 'controller', 'neon', 'nintendo'],
    specifications: {
      'Connectivity': 'Wireless',
      'Battery Life': 'Approximately 20 hours',
      'Features': 'HD Rumble, Motion Controls, IR Camera',
      'Colors': 'Neon Red (L), Neon Blue (R)'
    }
  },
  {
    name: 'Pokémon Legends: Arceus',
    description: 'Get ready for a new kind of grand, Pokémon adventure in Pokémon Legends: Arceus, a brand-new game from Game Freak that blends action and exploration with the RPG roots of the Pokémon series.',
    price: 59.99,
    category: 'Games',
    brand: 'Nintendo',
    images: [
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop'
    ],
    stock: 25,
    featured: false,
    onSale: false,
    tags: ['pokemon', 'rpg', 'adventure', 'nintendo'],
    specifications: {
      'Platform': 'Nintendo Switch',
      'Genre': 'Action RPG',
      'Rating': 'E (Everyone)',
      'Players': '1'
    }
  },
  {
    name: 'Nintendo Switch Adjustable Charging Stand',
    description: 'Keep playing while you charge with the Nintendo Switch Adjustable Charging Stand. Adjust the viewing angle and charge your system using the USB-C port.',
    price: 19.99,
    category: 'Stands & Grips',
    brand: 'Nintendo',
    images: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=600&fit=crop'
    ],
    stock: 50,
    featured: false,
    onSale: false,
    tags: ['stand', 'charging', 'adjustable', 'nintendo'],
    specifications: {
      'Compatibility': 'Nintendo Switch',
      'Features': 'Adjustable viewing angle, USB-C charging',
      'Material': 'Plastic',
      'Dimensions': '5.5" x 3.5" x 3.1"'
    }
  }
];

const clearDatabase = async () => {
  try {
    console.log('🗑️  Clearing existing database...');
    
    // Get all collection names
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    if (collectionNames.length === 0) {
      console.log('   ℹ️  Database is already empty');
      return;
    }
    
    // Drop each collection
    for (const collectionName of collectionNames) {
      try {
        await mongoose.connection.db.collection(collectionName).drop();
        console.log(`   ✓ Dropped collection: ${collectionName}`);
      } catch (error) {
        if (error.message.includes('ns not found')) {
          console.log(`   ⚠️  Collection ${collectionName} was already empty`);
        } else {
          throw error;
        }
      }
    }
    
    console.log('✅ Database cleared successfully!');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }
};

const seedDatabase = async () => {
  try {
    // Clear the entire database first
    await clearDatabase();

    // Create admin user first
    console.log('\n👤 Creating users...');
    const adminUser = await User.create(users[0]);
    const regularUser = await User.create(users[1]);

    console.log(`   ✓ Admin user created: ${adminUser.email}`);
    console.log(`   ✓ Regular user created: ${regularUser.email}`);

    // Create products with admin as creator
    console.log('\n🎮 Creating products...');
    const productsWithCreator = products.map(product => ({
      ...product,
      createdBy: adminUser._id
    }));

    const createdProducts = await Product.insertMany(productsWithCreator);
    console.log(`   ✓ Created ${createdProducts.length} products`);

    // Add some sample reviews
    console.log('\n⭐ Adding sample reviews...');
    const sampleReviews = [
      {
        user: regularUser._id,
        name: regularUser.name,
        rating: 5,
        comment: 'Amazing game! The graphics are stunning and the gameplay is incredibly fun. Highly recommend!'
      },
      {
        user: adminUser._id,
        name: adminUser.name,
        rating: 4,
        comment: 'Great product, fast shipping. The build quality is excellent.'
      },
      {
        user: regularUser._id,
        name: regularUser.name,
        rating: 5,
        comment: 'Perfect for Nintendo Switch! Works exactly as expected.'
      },
      {
        user: adminUser._id,
        name: adminUser.name,
        rating: 3,
        comment: 'Good quality but a bit expensive. Overall satisfied with the purchase.'
      }
    ];

    // Add reviews to random products
    const reviewedProducts = [];
    for (let i = 0; i < Math.min(6, createdProducts.length); i++) {
      const product = createdProducts[i];
      const numReviews = Math.floor(Math.random() * 3) + 1; // 1-3 reviews per product
      const reviewsToAdd = [];
      
      for (let j = 0; j < numReviews; j++) {
        const randomReview = sampleReviews[Math.floor(Math.random() * sampleReviews.length)];
        reviewsToAdd.push({
          ...randomReview,
          rating: Math.floor(Math.random() * 2) + 4, // 4-5 star ratings
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
        });
      }
      
      product.reviews = reviewsToAdd;
      product.numReviews = reviewsToAdd.length;
      product.rating = reviewsToAdd.reduce((sum, review) => sum + review.rating, 0) / reviewsToAdd.length;
      
      await product.save();
      reviewedProducts.push(product.name);
    }

    console.log(`   ✓ Added reviews to ${reviewedProducts.length} products`);

    console.log('\n🎉 Sample data seeded successfully!');
    console.log('\n📋 Database Summary:');
    console.log(`   • Users: ${users.length}`);
    console.log(`   • Products: ${createdProducts.length}`);
    console.log(`   • Products with reviews: ${reviewedProducts.length}`);
    
    console.log('\n🔐 Login credentials:');
    console.log('   Admin: admin@nintendo.com / admin123');
    console.log('   User:  user@nintendo.com / user123');
    
    console.log('\n🚀 You can now start the application!');
    console.log('   Backend: npm run dev');
    console.log('   Frontend: npm run client');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
connectDB().then(() => {
  seedDatabase();
});
