const mongoose = require('mongoose');
const User = require('../models/User');

// Load environment variables
require('dotenv').config({ path: './config.env' });

const listModerators = async () => {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB Atlas');
    console.log('🔍 Searching for moderator accounts...\n');

    // Find all moderators
    const moderators = await User.find({ role: 'moderator' }).select('-password');

    if (moderators.length === 0) {
      console.log('❌ No moderator accounts found in the database');
      console.log('💡 Use one of these scripts to create a moderator:');
      console.log('   - node scripts/setup-moderator.js (creates default moderator)');
      console.log('   - node scripts/create-moderator.js <username> <email> <password>');
    } else {
      console.log(`✅ Found ${moderators.length} moderator account(s):\n`);
      
      moderators.forEach((mod, index) => {
        console.log(`👤 Moderator ${index + 1}:`);
        console.log(`   Username: ${mod.username}`);
        console.log(`   Email: ${mod.email}`);
        console.log(`   Phone: ${mod.phone}`);
        console.log(`   Status: ${mod.isActive ? '🟢 Active' : '🔴 Inactive'}`);
        console.log(`   Created: ${mod.createdAt.toLocaleDateString()}`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('❌ Error listing moderators:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB Atlas');
    process.exit(0);
  }
};

// Run the script
listModerators();
