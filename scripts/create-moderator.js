const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Load environment variables
require('dotenv').config({ path: './config.env' });

const createCustomModerator = async (username, email, password, phone = '+1234567890') => {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB Atlas');

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      console.log('⚠️  User already exists with this email or username');
      console.log(`Username: ${existingUser.username}`);
      console.log(`Email: ${existingUser.email}`);
      console.log(`Role: ${existingUser.role}`);
      process.exit(0);
    }

    // Create moderator user
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const moderator = new User({
      username,
      email,
      password: hashedPassword,
      role: 'moderator',
      phone,
      isActive: true
    });

    await moderator.save();

    console.log('✅ Moderator user created successfully!');
    console.log('📋 Login Credentials:');
    console.log(`   Username: ${username}`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: ${moderator.role}`);
    console.log('');
    console.log('🔐 You can now login with these credentials to access the moderator dashboard');

  } catch (error) {
    console.error('❌ Error creating moderator:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB Atlas');
    process.exit(0);
  }
};

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 3) {
  console.log('📝 Usage: node create-moderator.js <username> <email> <password> [phone]');
  console.log('📝 Example: node create-moderator.js admin admin@example.com admin123 +1234567890');
  console.log('');
  console.log('🔑 Default moderator credentials (if no args):');
  console.log('   Username: admin');
  console.log('   Email: admin@example.com');
  console.log('   Password: admin123');
  process.exit(1);
}

const [username, email, password, phone] = args;

// Create the moderator
createCustomModerator(username, email, password, phone);
