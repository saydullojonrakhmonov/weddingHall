 import axios from '../../utils/axiosInstance';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCouch,
  faMap,
  faPhone,
  faUsers,
  faCheck,
  faEdit,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import VenueDetails from './VenueDetail';


const AllVenues = () => {
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState('');
  const [deletingIds, setDeletingIds] = useState([]);
  const [approvingIds, setApprovingIds] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');

  const [selectedVenue, setSelectedVenue] = useState(null);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetchVenues();
  }, [searchTerm, sortField, sortOrder, filterStatus, filterDistrict, token]);

  const fetchVenues = async () => {
    try {
      const params = new URLSearchParams();

      if (searchTerm) params.append('search', searchTerm);
      if (sortField) params.append('sortField', sortField);
      if (sortOrder) params.append('sortOrder', sortOrder);
      if (filterStatus) params.append('status', filterStatus);
      if (filterDistrict) params.append('district', filterDistrict);

      const res = await axios.get(`/admin/venues?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setVenues(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch venues.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this venue?')) return;

    setDeletingIds((prev) => [...prev, id]);
    setError('');

    try {
      await axios.delete(`/admin/venues/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVenues((prev) => prev.filter((venue) => venue.id !== id));
    } catch (err) {
      setError('Failed to delete venue. Please try again.');
    } finally {
      setDeletingIds((prev) => prev.filter((vid) => vid !== id));
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-venue/${id}`);
  };

  const handleApprove = async (id) => {
    setApprovingIds((prev) => [...prev, id]);
    setError('');

    try {
      const res = await axios.put(`/admin/venues/${id}/approve`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedVenue = res.data.approved_venue;

      setVenues((prev) =>
        prev.map((venue) => (venue.id === id ? updatedVenue : venue))
      );
    } catch (err) {
      setError('Failed to approve venue. Please try again.');
    } finally {
      setApprovingIds((prev) => prev.filter((vid) => vid !== id));
    }
  };

  return (
    <div className="px-6 py-10 bg-gray-50 min-h-screen max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-pink-600 mb-8">
        Wedding Venues
      </h1>

      {/* Search and Filter Controls */}
      <div className="mb-6 flex flex-wrap gap-4 justify-center">
        <input
          type="text"
          placeholder="Search venues..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-64"
        />

        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="name">Sort by Name</option>
          <option value="seat_price">Sort by Price</option>
          <option value="capacity">Sort by Capacity</option>
          <option value="district">Sort by District</option>
          <option value="status">Sort by Status</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="asc">A</option>
          <option value="desc">Z</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Filter by Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      {/* Venues List */}
      {venues.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full cursor-pointer"
              onClick={() => setSelectedVenue(venue)}
            >
              <img
                src={`http://localhost:10000/uploads/${venue.preview_image || 'default.jpg'}`}
                alt={venue.name}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{venue.name}</h2>
              <p>
                <FontAwesomeIcon icon={faMap} /> <strong>District:</strong> {venue.district}
              </p>
              <p>
                <FontAwesomeIcon icon={faCouch} /> <strong>Seat Price:</strong> ${venue.seat_price}
              </p>
              <p>
                <FontAwesomeIcon icon={faUsers} /> <strong>Capacity:</strong> {venue.capacity}
              </p>
              <p>
                <FontAwesomeIcon icon={faPhone} /> <strong>Phone:</strong> {venue.phone_number}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                <span className="capitalize">{venue.status}</span>
              </p>

              <div className="flex flex-wrap gap-3 mt-auto pt-4">
                {venue.status !== 'approved' ? (
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApprove(venue.id);
                    }}
                    disabled={approvingIds.includes(venue.id)}
                  >
                    <FontAwesomeIcon icon={faCheck} /> Approve
                  </button>
                ) : (
                  <button
                    className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed flex items-center gap-2"
                    disabled
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FontAwesomeIcon icon={faCheck} /> Approved
                  </button>
                )}

                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(venue.id);
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>

                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(venue.id);
                  }}
                  disabled={deletingIds.includes(venue.id)}
                >
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No venues available.</p>
      )}

      {/* Venue Details Modal */}
      {selectedVenue && (
        <VenueDetails
          venue={selectedVenue}
          onClose={() => setSelectedVenue(null)}
        />
      )}
    </div>
  );
};

export default AllVenues;
