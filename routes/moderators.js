const express = require('express');
const { body, validationResult } = require('express-validator');
const Item = require('../models/Item');
const { auth, isModerator } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/moderators/pending
// @desc    Get all pending items for moderation
// @access  Private (Moderator only)
router.get('/pending', auth, isModerator, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const items = await Item.find({ status: 'pending' })
      .populate('reporter', 'username email phone')
      .sort({ createdAt: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Item.countDocuments({ status: 'pending' });

    res.json({
      items,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get pending items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/moderators/stats
// @desc    Get moderation statistics
// @access  Private (Moderator only)
router.get('/stats', auth, isModerator, async (req, res) => {
  try {
    const stats = await Item.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalItems = await Item.countDocuments();
    const pendingCount = stats.find(s => s._id === 'pending')?.count || 0;
    const approvedCount = stats.find(s => s._id === 'approved')?.count || 0;
    const rejectedCount = stats.find(s => s._id === 'rejected')?.count || 0;
    const claimedCount = stats.find(s => s._id === 'claimed')?.count || 0;

    res.json({
      total: totalItems,
      pending: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount,
      claimed: claimedCount
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/moderators/:id/approve
// @desc    Approve a pending item
// @access  Private (Moderator only)
router.post('/:id/approve', auth, isModerator, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.status !== 'pending') {
      return res.status(400).json({ message: 'Can only approve pending items' });
    }

    // Update item status
    item.status = 'approved';
    item.moderator = req.user._id;
    item.moderatedAt = new Date();
    await item.save();

    // Send notification to reporter
    const notificationData = {
      message: `Your ${item.type} item "${item.title}" has been approved!`,
      type: 'item_approved'
    };
    
    console.log(`🔔 NOTIFICATION: ${notificationData.message}`);

    res.json({
      message: 'Item approved successfully',
      item
    });
  } catch (error) {
    console.error('Approve item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/moderators/:id/reject
// @desc    Reject a pending item
// @access  Private (Moderator only)
router.post('/:id/reject', auth, isModerator, [
  body('rejectionReason').notEmpty().withMessage('Rejection reason is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rejectionReason } = req.body;
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.status !== 'pending') {
      return res.status(400).json({ message: 'Can only reject pending items' });
    }

    // Update item status
    item.status = 'rejected';
    item.moderator = req.user._id;
    item.moderatedAt = new Date();
    item.rejectionReason = rejectionReason;
    await item.save();

    // Send notification to reporter
    const notificationData = {
      message: `Your ${item.type} item "${item.title}" was rejected. Reason: ${rejectionReason}`,
      type: 'item_rejected'
    };
    
    console.log(`🔔 NOTIFICATION: ${notificationData.message}`);

    res.json({
      message: 'Item rejected successfully',
      item
    });
  } catch (error) {
    console.error('Reject item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/moderators/recent-activity
// @desc    Get recent moderation activity
// @access  Private (Moderator only)
router.get('/recent-activity', auth, isModerator, async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const items = await Item.find({
      status: { $in: ['approved', 'rejected'] },
      moderator: { $exists: true }
    })
      .populate('reporter', 'username')
      .populate('moderator', 'username')
      .sort({ moderatedAt: -1 })
      .limit(parseInt(limit));

    res.json(items);
  } catch (error) {
    console.error('Get recent activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/moderators/search
// @desc    Search items for moderation
// @access  Private (Moderator only)
router.get('/search', auth, isModerator, async (req, res) => {
  try {
    const { q, status, type, category, page = 1, limit = 10 } = req.query;
    
    const query = {};
    
    if (status) query.status = status;
    if (type) query.type = type;
    if (category) query.category = category;
    if (q) {
      query.$text = { $search: q };
    }

    const items = await Item.find(query)
      .populate('reporter', 'username email phone')
      .populate('moderator', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Item.countDocuments(query);

    res.json({
      items,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Search items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
