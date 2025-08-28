import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const SubmitItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: 'lost',
    location: '',
    date: new Date().toISOString().split('T')[0],
    tags: '',
    isUrgent: false
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      const submitData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        date: new Date(formData.date).toISOString()
      };

      const response = await axios.post('/api/items', submitData);
      
      toast.success('Item submitted successfully! It will be reviewed by our moderators.');
      navigate('/my-items');
    } catch (error) {
      const message = error.response?.data?.message || 'Error submitting item';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link to="/" className="btn btn-outline mr-4">
            <FaArrowLeft className="mr-2" />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Submit {formData.type === 'lost' ? 'Lost' : 'Found'} Item
          </h1>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Item Type Selection */}
            <div className="form-group">
              <label className="form-label">Item Type *</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="lost"
                    checked={formData.type === 'lost'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Lost Item
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="found"
                    checked={formData.type === 'found'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Found Item
                </label>
              </div>
            </div>

            {/* Title */}
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Item Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                placeholder={`Enter a descriptive title for the ${formData.type} item`}
                minLength="3"
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                placeholder={`Provide detailed description of the ${formData.type} item`}
                minLength="10"
                rows="4"
              />
            </div>

            {/* Category and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="category" className="form-label">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select a category</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="jewelry">Jewelry</option>
                  <option value="books">Books</option>
                  <option value="documents">Documents</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="location" className="form-label">
                  Location *
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Where was it lost/found?"
                />
              </div>
            </div>

            {/* Date */}
            <div className="form-group">
              <label htmlFor="date" className="form-label">
                Date *
              </label>
              <input
                id="date"
                name="date"
                type="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="form-input"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Tags */}
            <div className="form-group">
              <label htmlFor="tags" className="form-label">
                Tags (optional)
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter tags separated by commas (e.g., red, small, brand)"
              />
              <p className="text-sm text-gray-500 mt-1">
                Tags help others find your item more easily
              </p>
            </div>

            {/* Urgent Flag */}
            <div className="form-group">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isUrgent"
                  checked={formData.isUrgent}
                  onChange={handleChange}
                  className="mr-2"
                />
                Mark as urgent
              </label>
              <p className="text-sm text-gray-500 mt-1">
                Urgent items will be prioritized for review
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link to="/" className="btn btn-outline">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Submit Item
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center text-gray-600">
          <p className="mb-2">
            <strong>Note:</strong> All submitted items are reviewed by our moderators before being published.
          </p>
          <p>
            This helps maintain the quality and accuracy of our lost and found database.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubmitItem;
