import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const MyItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchMyItems();
  }, []);

  const fetchMyItems = async () => {
    try {
      const response = await axios.get('/api/items/my-items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Failed to load your items');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item._id);
    setEditForm({
      title: item.title,
      description: item.description,
      category: item.category,
      location: item.location,
      date: new Date(item.date).toISOString().split('T')[0],
      tags: item.tags?.join(', ') || '',
      isUrgent: item.isUrgent
    });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditForm({});
  };

  const handleSaveEdit = async (itemId) => {
    try {
      const updateData = {
        ...editForm,
        tags: editForm.tags ? editForm.tags.split(',').map(tag => tag.trim()) : [],
        date: new Date(editForm.date).toISOString()
      };

      await axios.put(`/api/items/${itemId}`, updateData);
      toast.success('Item updated successfully! It will be reviewed again.');
      setEditingItem(null);
      setEditForm({});
      fetchMyItems();
    } catch (error) {
      toast.error('Failed to update item');
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`/api/items/${itemId}`);
        toast.success('Item deleted successfully!');
        fetchMyItems();
      } catch (error) {
        toast.error('Failed to delete item');
      }
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

  const getStatusIcon = (status) => {
    if (status === 'approved') return <FaCheck className="text-green-500" />;
    if (status === 'rejected') return <FaTimes className="text-red-500" />;
    return null;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your items...</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Items</h1>
            <p className="text-gray-600">Manage your submitted lost and found items</p>
          </div>
          <Link to="/submit" className="btn btn-primary">
            <FaPlus className="mr-2" />
            Submit New Item
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No items yet</h3>
            <p className="text-gray-600 mb-6">Start by submitting your first lost or found item</p>
            <Link to="/submit" className="btn btn-primary">
              <FaPlus className="mr-2" />
              Submit Your First Item
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {items.map((item) => (
              <div key={item._id} className="card">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
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
                  {getStatusIcon(item.status)}
                </div>

                {/* Content */}
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{item.description}</p>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-4">
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
                    <strong>Submitted:</strong> {format(new Date(item.createdAt), 'MMM dd, yyyy')}
                  </div>
                </div>

                {/* Rejection Reason */}
                {item.status === 'rejected' && item.rejectionReason && (
                  <div className="alert alert-error mb-4">
                    <strong>Rejection Reason:</strong> {item.rejectionReason}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Link
                      to={`/item/${item._id}`}
                      className="btn btn-outline"
                    >
                      <FaEye className="mr-2" />
                      View
                    </Link>
                    
                    {item.status === 'pending' && (
                      <button
                        onClick={() => handleEdit(item)}
                        className="btn btn-outline"
                      >
                        <FaEdit className="mr-2" />
                        Edit
                      </button>
                    )}
                    
                    {item.status === 'pending' && (
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="btn btn-danger"
                      >
                        <FaTrash className="mr-2" />
                        Delete
                      </button>
                    )}
                  </div>

                  <div className="text-sm text-gray-500">
                    {item.status === 'claimed' && item.claimedAt && (
                      <span>Claimed on {format(new Date(item.claimedAt), 'MMM dd, yyyy')}</span>
                    )}
                  </div>
                </div>

                {/* Edit Form */}
                {editingItem === item._id && (
                  <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h4 className="font-semibold mb-3">Edit Item</h4>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Title"
                        value={editForm.title}
                        onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                        className="form-input"
                      />
                      <textarea
                        placeholder="Description"
                        value={editForm.description}
                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        className="form-textarea"
                        rows="3"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <select
                          value={editForm.category}
                          onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                          className="form-select"
                        >
                          <option value="">Select category</option>
                          <option value="electronics">Electronics</option>
                          <option value="clothing">Clothing</option>
                          <option value="jewelry">Jewelry</option>
                          <option value="books">Books</option>
                          <option value="documents">Documents</option>
                          <option value="other">Other</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Location"
                          value={editForm.location}
                          onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                          className="form-input"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSaveEdit(item._id)}
                          className="btn btn-success"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="btn btn-outline"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyItems;
