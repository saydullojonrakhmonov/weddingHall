import React, { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateVenue = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    seat_price: '',
    capacity: '',
    phone_number: '',
    status: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch venue details on mount
  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const res = await axios.get(`/admin/venues/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const venue = res.data.venue || res.data;

        setFormData({
          name: venue.name || '',
          address: venue.address || '',
          seat_price: venue.seat_price || '',
          capacity: venue.capacity || '',
          phone_number: venue.phone_number || '',
          status: venue.status || '',
        });
      } catch (err) {
        setError('Failed to fetch venue details.');
        console.error(err);
      }
    };

    fetchVenue();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.put(`/admin/venues/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/admin/all-venues');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update venue.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-pink-600">
        Update Venue
      </h2>

      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Name *</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded"
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Address *</span>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded"
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Seat Price *</span>
          <input
            type="number"
            name="seat_price"
            value={formData.seat_price}
            onChange={handleChange}
            min="0"
            required
            className="w-full mt-1 p-2 border rounded"
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Capacity *</span>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            min="1"
            required
            className="w-full mt-1 p-2 border rounded"
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Phone Number</span>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Status *</span>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded"
          >
            <option value="">Select status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold p-3 rounded mt-4 cursor-pointer"
        >
          {loading ? 'Updating...' : 'Update Venue'}
        </button>
      </form>
    </div>
  );
};

export default UpdateVenue;
