import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from '../../utils/axiosInstance';
import TailwindDatePicker from "../../components/TailwindDatePicker/TailwindDatePicker";

const VenueBooking = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [venue, setVenue] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [bookedDates, setBookedDates] = useState([]);

    const [formData, setFormData] = useState({
        phone_number: "",
        guest_amount: "",
        user_id: localStorage.getItem('user_id')
      });
      

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchVenue = async () => {
            try {
                const res = await axios.get(`/user/venues/${id}`);
                setVenue(res.data.venue);
            } catch (err) {
                setError("Failed to load venue");
            }
        };

        const fetchBookedDates = async () => {
            try {
                const res = await axios.get(`/user/venues/${id}/booked-dates`);
                setBookedDates(res.data.bookedDates || []);
            } catch (err) {
                console.error("Failed to load booked dates", err);
            }
        };

        fetchVenue();
        fetchBookedDates();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDateChange = (dateStr) => {
        setSelectedDate(dateStr);
    };


    const handleBooking = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!selectedDate) {
            setError("Please select a valid date.");
            return;
        }

        const bookingData = {
            ...formData,
            reservation_date: selectedDate,
        };

        const token = localStorage.getItem('token');

        if (!token) {
            setError("You must be logged in to make a booking.");
            return;
        }

        try {
            const response = await axios.post(
                `/user/venues/${id}/book`,
                bookingData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Booking response:", response.data); // ✅ Log the success response

            setSuccess("Booking successful!");
            setTimeout(() => navigate("/"), 1000);
        } catch (err) {
            console.error("Booking error:", err); // ✅ Log full error

            if (err.response?.status === 409) {
                setError("This date is already booked.");
            } else {
                setError("Booking failed. Please check your inputs.");
            }
        }
    };


    if (!venue) return <p className="text-center mt-10">Loading venue...</p>;

    return (
        <div className="min-h-screen pt-28 px-4 sm:px-8 bg-[#eaf4fc] pb-10">
            <div className="max-w-xl mx-auto bg-white/90 p-8 rounded-3xl shadow-xl border border-pink-200">
                <h2 className="text-3xl font-bold mb-6 text-pink-600 text-center">
                    Book {venue.name}
                </h2>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {success && <p className="text-green-600 text-center mb-4">{success}</p>}

                <form onSubmit={handleBooking} className="space-y-5">
                    {/* <input
                        type="text"
                        name="first_name"
                        placeholder="First Name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />

                    <input
                        type="text"
                        name="last_name"
                        placeholder="Last Name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    /> */}

                    <input
                        type="tel"
                        name="phone_number"
                        placeholder="Phone Number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />

                    <input
                        type="number"
                        name="guest_amount"
                        placeholder="Number of Guests"
                        value={formData.guest_amount}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select a Date</label>
                        <TailwindDatePicker
                            selectedDate={selectedDate}
                            onDateChange={handleDateChange}
                            bookedDates={bookedDates}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg font-semibold shadow-md transition-all"
                    >
                        Submit Booking
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VenueBooking;
