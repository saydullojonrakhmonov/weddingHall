import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarDays,
  faUserGroup,
  faMapLocationDot,
  faPhone,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import axios from '../../utils/axiosInstance';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const user_id = localStorage.getItem('user_id');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user_id || !token) {
      console.warn("🔒 Missing user ID or token in localStorage.");
      setError("You must be logged in to view your bookings.");
      setStatus("error");
      return;
    }

    const fetchBookings = async () => {
      setStatus('loading');
      try {
        const response = await axios.get('/user/bookings', {
          params: { user_id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("✅ Bookings fetched:", response.data.bookings);
        setBookings(response.data.bookings || []);
        setStatus('success');
      } catch (err) {
        console.error("❌ Error fetching bookings:", err);
        // Check for auth errors and redirect to login
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user_id');
          navigate('/login');
          return; // Stop further execution
        }
        setError(err.response?.data?.message || err.message || 'Failed to load bookings');
        setStatus('error');
      }
    };

    fetchBookings();
  }, [user_id, token, navigate]);

  const renderContent = () => {
    if (status === 'loading') {
      return <p className="text-center text-gray-600">Loading your bookings...</p>;
    }

    if (status === 'error') {
      return <p className="text-center text-red-600 font-semibold">Error: {error}</p>;
    }

    if (status === 'success' && bookings.length === 0) {
      return <p className="text-center text-gray-700">You haven't made any bookings yet.</p>;
    }

    if (status === 'success') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 cursor-pointer">
          {bookings.map(({ id, reservation_date, guest_amount, venue_name, venue_location, phone_number, status }) => (
            <div
              key={id}
              className="backdrop-blur-lg bg-white/70 shadow-xl rounded-2xl overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-pink-300"
            >
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-pink-600 mb-2">{venue_name}</h2>

                <p className="text-gray-700 mb-1">
                  <FontAwesomeIcon icon={faMapLocationDot} className="text-pink-500 mr-2" />
                  <span className="font-medium">Location:</span> {venue_location}
                </p>

                <p className="text-gray-700 mb-1">
                  <FontAwesomeIcon icon={faPhone} className="text-pink-500 mr-2" />
                  <span className="font-medium">Phone:</span> {phone_number}
                </p>
                <p className="text-gray-700 mb-1">
                  <FontAwesomeIcon icon={faCalendarDays} className="text-pink-500 mr-2" />
                  <span className="font-medium">Date:</span> {new Date(reservation_date).toLocaleDateString()}
                </p>

                <p className="text-gray-700 mb-1">
                  <FontAwesomeIcon icon={faUserGroup} className="text-pink-500 mr-2" />
                  <span className="font-medium">Guests:</span> {guest_amount}
                </p>

                <p className={`flex items-center gap-2 text-sm font-semibold mt-2 
                    ${status === 'cancelled' ? 'text-red-500' : 'text-green-600'}`}>
                  Status: {status === 'cancelled' ? 'Cancelled' : 'Booked'}
                </p>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <Header />
      <div className="mx-auto px-4 py-10 pt-20 bg-gradient-to-br from-pink-50 to-white min-h-screen max-w-7xl">
        <h1 className="text-3xl font-bold text-center text-pink-600 mb-10">My Bookings</h1>
        {renderContent()}
      </div>
    </>
  );
};

export default MyBookings;
