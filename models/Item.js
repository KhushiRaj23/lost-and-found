const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10
  },
  category: {
    type: String,
    required: true,
    enum: ['electronics', 'clothing', 'jewelry', 'books', 'documents', 'other']
  },
  type: {
    type: String,
    required: true,
    enum: ['lost', 'found']
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected', 'claimed'],
    default: 'pending'
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  claimant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  claimedAt: {
    type: Date
  },
  moderator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderatedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    trim: true
  },
  images: [{
    type: String
  }],
  contactInfo: {
    phone: String,
    email: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  isUrgent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better search performance
itemSchema.index({ title: 'text', description: 'text', location: 'text' });
itemSchema.index({ status: 1, type: 1 });
itemSchema.index({ reporter: 1 });
itemSchema.index({ claimant: 1 });

module.exports = mongoose.model('Item', itemSchema);
