import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaArrowLeft, FaUser, FaMapMarkerAlt, FaCalendar, FaTag, FaCheck, FaPhone, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ItemDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const response = await axios.get(`/api/items/${id}`);
      setItem(response.data);
    } catch (error) {
      console.error('Error fetching item:', error);
      toast.error('Failed to load item details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to claim this item');
      navigate('/login');
      return;
    }

    setClaiming(true);
    
    try {
      await axios.post(`/api/items/${id}/claim`);
      toast.success('Item claimed successfully! The owner will be notified.');
      fetchItem(); // Refresh item data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to claim item';
      toast.error(message);
    } finally {
      setClaiming(false);
    }
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

  const getCategoryIcon = (category) => {
    const icons = {
      electronics: '📱',
      clothing: '👕',
      jewelry: '💍',
      books: '📚',
      documents: '📄',
      other: '🔍'
    };
    return icons[category] || '🔍';
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading item details...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Item not found</h2>
        <Link to="/" className="btn btn-primary">
          <FaArrowLeft className="mr-2" />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link to="/" className="btn btn-outline mr-4">
            <FaArrowLeft className="mr-2" />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="card mb-6">
              {/* Status and Type Badges */}
              <div className="flex items-center space-x-3 mb-4">
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

              {/* Category Icon and Title */}
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{getCategoryIcon(item.category)}</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h2>
                <p className="text-gray-600">{item.description}</p>
              </div>

              {/* Item Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center space-x-3">
                  <FaTag className="text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Category</div>
                    <div className="font-medium capitalize">{item.category}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Location</div>
                    <div className="font-medium">{item.location}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FaCalendar className="text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Date</div>
                    <div className="font-medium">
                      {format(new Date(item.date), 'MMMM dd, yyyy')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FaUser className="text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Submitted by</div>
                    <div className="font-medium">{item.reporter?.username}</div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="mb-6">
                  <div className="text-sm text-gray-500 mb-2">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Claim Button for Found Items */}
              {item.type === 'found' && item.status === 'approved' && !item.claimant && (
                <div className="text-center">
                  <button
                    onClick={handleClaim}
                    disabled={claiming}
                    className="btn btn-success text-lg px-8 py-3 disabled:opacity-50"
                  >
                    {claiming ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Claiming...
                      </div>
                    ) : (
                      <>
                        <FaCheck className="mr-2" />
                        Claim This Item
                      </>
                    )}
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    Click to claim this found item
                  </p>
                </div>
              )}

              {/* Claimed Status */}
              {item.claimant && (
                <div className="alert alert-info">
                  <strong>This item has been claimed</strong>
                  <p className="mt-1">
                    Claimed by {item.claimant.username} on{' '}
                    {format(new Date(item.claimedAt), 'MMMM dd, yyyy')}
                  </p>
                </div>
              )}

              {/* Rejection Reason */}
              {item.status === 'rejected' && item.rejectionReason && (
                <div className="alert alert-error">
                  <strong>Item Rejected</strong>
                  <p className="mt-1">Reason: {item.rejectionReason}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Reporter Information */}
            <div className="card mb-6">
              <h3 className="text-lg font-semibold mb-4">Reporter Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <FaUser className="text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Username</div>
                    <div className="font-medium">{item.reporter?.username}</div>
                  </div>
                </div>

                {item.reporter?.phone && (
                  <div className="flex items-center space-x-3">
                    <FaPhone className="text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <div className="font-medium">{item.reporter.phone}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-medium">{item.reporter?.email}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Item Timeline */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Item Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">Submitted</div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(item.createdAt), 'MMM dd, yyyy HH:mm')} • by {item.reporter?.username}
                    </div>
                  </div>
                </div>

                {item.moderatedAt && (
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      item.status === 'approved' || item.status === 'claimed' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <div className="text-sm font-medium capitalize">
                        {item.status === 'rejected' ? 'Rejected' : 'Approved'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(item.moderatedAt), 'MMM dd, yyyy HH:mm')} {item.moderator ? `• by ${item.moderator.username}` : ''}
                      </div>
                    </div>
                  </div>
                )}

                {item.claimedAt && (
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <div>
                      <div className="text-sm font-medium">Claimed</div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(item.claimedAt), 'MMM dd, yyyy HH:mm')} {item.claimant ? `• by ${item.claimant.username}` : ''}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
