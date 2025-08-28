import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import {
  FaSearch,
  FaPlus,
  FaEye,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUser,
  FaCheck,
} from "react-icons/fa";
import { format } from "date-fns";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ useCallback to fix dependency warning
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 12,
      };

      if (searchTerm) params.search = searchTerm;
      if (selectedType) params.type = selectedType;
      if (selectedCategory) params.category = selectedCategory;

      const response = await axios.get("/api/items", { params });
      setItems(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedType, selectedCategory, searchTerm]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "badge-pending",
      approved: "badge-approved",
      rejected: "badge-rejected",
      claimed: "badge-claimed",
    };
    return badges[status] || "badge-pending";
  };

  const getTypeBadge = (type) => {
    return type === "lost" ? "badge-lost" : "badge-found";
  };

  const getCategoryIcon = (category) => {
    const icons = {
      electronics: "📱",
      clothing: "👕",
      jewelry: "💍",
      books: "📚",
      documents: "📄",
      other: "🔍",
    };
    return icons[category] || "🔍";
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="loading-spinner mx-auto mb-6"></div>
        <p className="text-text-secondary text-lg">Loading items...</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-3xl blur-3xl"></div>
          <div className="relative bg-bg-card border border-border-primary rounded-3xl p-12 shadow-xl">
            <h1 className="text-5xl font-bold gradient-text mb-6">
              Find Your Lost Items
            </h1>
            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
              Report lost items or found ones. Our community helps reunite people
              with their belongings.
            </p>
            {isAuthenticated && (
              <Link
                to="/submit"
                className="btn btn-primary text-lg px-10 py-4 hover:scale-105 transition-transform"
              >
                <FaPlus className="mr-3" />
                Submit New Item
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card mb-12 glass">
        <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
          Search & Filter
        </h2>
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="md:col-span-2">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted text-lg" />
              <input
                type="text"
                placeholder="Search items by title, description, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-12 text-lg"
              />
            </div>
          </div>
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              handleFilterChange();
            }}
            className="form-select text-lg"
          >
            <option value="">All Types</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              handleFilterChange();
            }}
            className="form-select text-lg"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="jewelry">Jewelry</option>
            <option value="books">Books</option>
            <option value="documents">Documents</option>
            <option value="other">Other</option>
          </select>
        </form>
      </div>

      {/* Items Grid */}
      {items.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-2xl font-semibold text-text-secondary mb-4">
            No items found
          </h3>
          <p className="text-text-muted text-lg">
            Try adjusting your search criteria or check back later.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((item) => (
              <div
                key={item._id}
                className="card hover-lift group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className={`badge ${getTypeBadge(item.type)}`}>
                    {item.type === "lost" ? "Lost" : "Found"}
                  </span>
                  <span className={`badge ${getStatusBadge(item.status)}`}>
                    {item.status}
                  </span>
                </div>

                <div className="text-center mb-4">
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {getCategoryIcon(item.category)}
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-text-primary group-hover:text-text-accent transition-colors">
                    {item.title}
                  </h3>
                </div>

                <p className="text-text-secondary text-sm mb-4 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-text-muted text-sm">
                    <FaMapMarkerAlt className="mr-2 text-text-accent" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center text-text-muted text-sm">
                    <FaCalendarAlt className="mr-2 text-text-accent" />
                    <span>{format(new Date(item.date), "MMM dd, yyyy")}</span>
                  </div>
                  <div className="flex items-center text-text-muted text-sm">
                    <FaUser className="mr-2 text-text-accent" />
                    <span>{item.user?.username || "Anonymous"}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={`/item/${item._id}`}
                    className="btn btn-outline flex-1 group-hover:bg-border-accent group-hover:text-white transition-all duration-300"
                  >
                    <FaEye className="mr-2" />
                    View Details
                  </Link>

                  {/* Quick Claim Button for Found Items */}
                  {item.type === "found" &&
                    item.status === "approved" &&
                    !item.claimant && (
                      <button
                        onClick={() => navigate(`/item/${item._id}`)}
                        className="btn btn-success flex-1 group-hover:scale-105 transition-all duration-300"
                        title="Claim this item"
                      >
                        <FaCheck className="mr-2" />
                        Claim
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <span className="flex items-center px-4 py-2 text-text-secondary">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
