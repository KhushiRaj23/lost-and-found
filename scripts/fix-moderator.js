const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Load environment variables
require('dotenv').config({ path: '../config.env' });

const fixModerator = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lost-found-portal', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Remove existing moderator
    await User.deleteOne({ email: 'moderator@example.com' });
    console.log('🗑️  Removed old moderator account');

    // Create new moderator user with properly hashed password
    const hashedPassword = await bcrypt.hash('moderator123', 10);
    
    const moderator = new User({
      username: 'moderator',
      email: 'moderator@example.com',
      password: hashedPassword,
      role: 'moderator',
      phone: '+1234567890',
      isActive: true
    });

    await moderator.save();

    console.log('✅ Moderator user recreated successfully!');
    console.log('📋 Login Credentials:');
    console.log('   Email: moderator@example.com');
    console.log('   Password: moderator123');
    console.log('   Role: moderator');
    console.log('');
    console.log('🔐 You can now login with these credentials to access the moderator dashboard');

  } catch (error) {
    console.error('❌ Error fixing moderator:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the script
fixModerator();
