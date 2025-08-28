import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaEye, FaChartBar, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ModeratorDashboard = () => {
  const [pendingItems, setPendingItems] = useState([]);
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [currentPage]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [pendingRes, statsRes, activityRes] = await Promise.all([
        axios.get(`/api/moderators/pending?page=${currentPage}`),
        axios.get('/api/moderators/stats'),
        axios.get('/api/moderators/recent-activity')
      ]);

      setPendingItems(pendingRes.data.items);
      setTotalPages(pendingRes.data.totalPages);
      setStats(statsRes.data);
      setRecentActivity(activityRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (itemId) => {
    try {
      await axios.post(`/api/moderators/${itemId}/approve`);
      toast.success('Item approved successfully!');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to approve item');
    }
  };

  const handleReject = async (itemId) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      await axios.post(`/api/moderators/${itemId}/reject`, {
        rejectionReason: rejectionReason.trim()
      });
      toast.success('Item rejected successfully!');
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedItem(null);
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to reject item');
    }
  };

  const openRejectModal = (item) => {
    setSelectedItem(item);
    setShowRejectModal(true);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-pending',
      approved: 'badge-approved',
      rejected: 'badge-rejected',
      claimed: 'badge-claimed'
    };
    return badges[status] || 'badge-pending';
  };

  const getTypeBadge = (type) => {
    return type === 'lost' ? 'badge-lost' : 'badge-found';
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading moderator dashboard...</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Moderator Dashboard</h1>
          <p className="text-gray-600">Review and manage submitted items</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.total || 0}</div>
            <div className="text-gray-600">Total Items</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.pending || 0}</div>
            <div className="text-gray-600">Pending Review</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.approved || 0}</div>
            <div className="text-gray-600">Approved</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">{stats.rejected || 0}</div>
            <div className="text-gray-600">Rejected</div>
          </div>
        </div>

        {/* Pending Items */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <FaClock className="mr-2 text-yellow-600" />
            Pending Items ({pendingItems.length})
          </h2>

          {pendingItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FaCheckCircle className="text-4xl mx-auto mb-4 text-green-500" />
              <p>No pending items to review!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingItems.map((item) => (
                <div key={item._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className={`badge ${getTypeBadge(item.type)}`}>
                        {item.type === 'lost' ? 'Lost' : 'Found'}
                      </span>
                      <span className={`badge ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                      {item.isUrgent && (
                        <span className="badge badge-pending">Urgent</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(item.createdAt), 'MMM dd, yyyy HH:mm')}
                    </div>
                  </div>

                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-3">{item.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 mb-4">
                    <div>
                      <strong>Category:</strong> {item.category}
                    </div>
                    <div>
                      <strong>Location:</strong> {item.location}
                    </div>
                    <div>
                      <strong>Date:</strong> {format(new Date(item.date), 'MMM dd, yyyy')}
                    </div>
                    <div>
                      <strong>Reporter:</strong> {item.reporter?.username}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(item._id)}
                        className="btn btn-success"
                      >
                        <FaCheck className="mr-2" />
                        Approve
                      </button>
                      <button
                        onClick={() => openRejectModal(item)}
                        className="btn btn-danger"
                      >
                        <FaTimes className="mr-2" />
                        Reject
                      </button>
                    </div>
                    <div className="text-sm text-gray-500">
                      Contact: {item.reporter?.email} {item.reporter?.phone && `| ${item.reporter.phone}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="btn btn-outline disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`btn ${currentPage === page ? 'btn-primary' : 'btn-outline'}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="btn btn-outline disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <FaChartBar className="mr-2 text-blue-600" />
            Recent Activity
          </h2>
          
          <div className="space-y-3">
            {recentActivity.map((item) => (
              <div key={item._id} className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  {item.status === 'approved' ? (
                    <FaCheckCircle className="text-green-500" />
                  ) : (
                    <FaTimesCircle className="text-red-500" />
                  )}
                  <div>
                    <span className="font-medium">{item.title}</span>
                    <span className="text-gray-500 ml-2">
                      by {item.reporter?.username}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {item.moderatedAt && format(new Date(item.moderatedAt), 'MMM dd, HH:mm')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Reject Item</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting "{selectedItem?.title}"
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="form-textarea mb-4"
              placeholder="Enter rejection reason..."
              rows="3"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                  setSelectedItem(null);
                }}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedItem._id)}
                className="btn btn-danger"
              >
                Reject Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeratorDashboard;
