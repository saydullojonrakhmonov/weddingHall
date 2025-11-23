import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faUsers, faCouch, faPhone } from '@fortawesome/free-solid-svg-icons';

const VenueDetail = () => {
    const { id } = useParams();
    const [venue, setVenue] = useState(null);
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_URL
    const navigate = useNavigate()

    useEffect(() => {
        const fetchVenue = async () => {
            try {
                const res = await axios.get(`/user/venue/${id}`);
                setVenue(res.data.venue);
                setImages(res.data.images);
                console.log(res);
            } catch (err) {
                console.error(err);
                setError('Failed to load venue');
            }
        };

        fetchVenue();
    }, [id]);

    if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
    if (!venue) return <p className="text-gray-600 text-center mt-10">Loading...</p>;

    const handleBooking = () => {
        const token = localStorage.getItem('token');
      
        if (!token) {
          navigate('/login');
        } else {
          navigate(`/venue/${id}/book`);
        }
      };
      

    return (
        <div className="pt-28 px-4 sm:px-8 bg-[#eaf4fc] min-h-screen pb-10">
            <h1 className="text-5xl font-extrabold text-center text-pink-600 mb-10 tracking-tight">{venue.name}</h1>

            {/* Full-width image section */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {images.map((img, idx) => (
                    <img
                        key={idx}
                        src={`${BASE_URL}/${img.image_path}`}
                        alt={`venue-${idx}`}
                        className="w-full h-72 sm:h-80 object-cover rounded-3xl shadow-md hover:scale-105 transition-transform duration-300"
                    />
                ))}
            </div>

            {/* Centered content box */}
            <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-pink-100">
                <div className="space-y-4 text-lg text-gray-700">
                    <p><FontAwesomeIcon icon={faMap} className="text-pink-500 mr-2" /><strong>Address:</strong> {venue.address}</p>
                    <p><FontAwesomeIcon icon={faCouch} className="text-pink-500 mr-2" /><strong>Seat Price:</strong> ${venue.seat_price}</p>
                    <p><FontAwesomeIcon icon={faUsers} className="text-pink-500 mr-2" /><strong>Capacity:</strong> {venue.capacity} guests</p>
                    <p><FontAwesomeIcon icon={faPhone} className="text-pink-500 mr-2" /><strong>Phone:</strong> {venue.phone_number}</p>
                    <p className="mt-4 italic text-sm text-pink-700 bg-pink-100 inline-block px-4 py-1 rounded-full shadow-sm">
                        Status: {venue.status}
                    </p>
                    <button
                        onClick={handleBooking}
                        className="mt-6 w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition duration-300 cursor-pointer"
                    >
                        Book This Hall
                    </button>

                </div>
            </div>
        </div>

    );
};

export default VenueDetail;
