import React, { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faUsers,
  faDollarSign,
  faPhone,
  faClock,
  faEdit,
  faCircleCheck,
  faCircleXmark
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const OwnVenue = () => {
  const [venue, setVenue] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const res = await axios.get('/owner/venues', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVenue(res.data.venue);
      } catch (err) {
        console.error('Failed to fetch venue:', err);
        setError('Failed to load your venue');
      }
    };

    fetchVenue();
  }, [token]);

  return (
    <div className="w-full min-h-screen font-serif bg-pink-50 m-0 p-0 overflow-hidden">
      <h2 className="text-3xl font-bold text-center text-pink-700 py-8 tracking-wide">
        My Wedding venue
      </h2>

      {error && <p className="text-red-600 text-center mb-6">{error}</p>}

      {venue.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">You haven't created any venue yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venue.map((venue) => (
            <div
              key={venue.id}
              className="bg-white rounded-2xl border border-pink-100 shadow-lg p-6 hover:shadow-xl transition-all"
            >
              <h3 className="text-2xl font-semibold text-pink-700 mb-3">{venue.name}</h3>
              <p className="text-sm text-gray-700 mb-2 flex items-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-pink-500 mr-2" />
                {venue.address}
              </p>
              <p className="text-sm text-gray-700 mb-2 flex items-center">
                <FontAwesomeIcon icon={faUsers} className="text-pink-500 mr-2" />
                Capacity: {venue.capacity}
              </p>
              <p className="text-sm text-gray-700 mb-2 flex items-center">
                <FontAwesomeIcon icon={faDollarSign} className="text-pink-500 mr-2" />
                Seat Price: ${venue.seat_price}
              </p>
              <p className="text-sm text-gray-700 mb-2 flex items-center">
                <FontAwesomeIcon icon={faPhone} className="text-pink-500 mr-2" />
                {venue.phone_number}
              </p>
              <p className="text-sm mt-3 flex items-center font-medium">
                {venue.status === 'approved' ? (
                  <span className="text-green-600 flex items-center">
                    <FontAwesomeIcon icon={faCircleCheck} className="mr-1" />
                    Approved
                  </span>
                ) : (
                  <span className="text-yellow-600 flex items-center">
                    <FontAwesomeIcon icon={faCircleXmark} className="mr-1" />
                    {venue.status.charAt(0).toUpperCase() + venue.status.slice(1)}
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-400 mt-1 flex items-center">
                <FontAwesomeIcon icon={faClock} className="mr-1" />
                Created: {new Date(venue.created_at).toLocaleString()}
              </p>

              <button
                onClick={() => navigate(`/owner/edit-venue/${venue.id}`)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-pink-600 text-white text-sm rounded-full hover:bg-pink-700 transition-all"
              >
                <FontAwesomeIcon icon={faEdit} />
                Edit Venue
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnVenue;
