import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay,
  isBefore,
  isToday,
  getDay
} from "date-fns";
import {
  faMapMarkerAlt,
  faDollarSign,
  faUsers,
  faPhoneAlt,
  faInfoCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const VenueDetails = ({ venue, onClose }) => {
  const token = localStorage.getItem("token");
  const [bookings, setBookings] = useState([]);
  const [selectedDateInfo, setSelectedDateInfo] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchBookings();
  }, [venue.id]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`/admin/venue/${venue.id}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to load bookings");
    }
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const getTileStatus = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    if (isBefore(date, new Date()) && !isToday(date)) return "past";
    if (bookings.find((b) => b.reservation_date === dateStr)) return "booked";
    return "free";
  };

  const handleDateClick = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const booking = bookings.find((b) => b.reservation_date === dateStr);
    if (booking) {
      setSelectedDateInfo({
        date: dateStr,
        bookedBy: `${booking.first_name} ${booking.last_name}`,
        seats: booking.guest_amount,
      });
    } else {
      setSelectedDateInfo(null);
    }
  };

  const renderCalendarGrid = () => {
    const firstDayOffset = getDay(startOfMonth(currentDate)); // Sunday=0
    const paddedDays = [...Array(firstDayOffset).fill(null), ...daysInMonth];

    return (
      <div className="grid grid-cols-7 gap-2 mt-4 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="font-semibold text-pink-600 uppercase">{day}</div>
        ))}

        {paddedDays.map((date, idx) => {
          if (!date) return <div key={`empty-${idx}`} />;
          const status = getTileStatus(date);
          const dateStr = format(date, "d");

          let bg = "";
          let text = "";
          switch (status) {
            case "past":
              bg = "bg-gray-200 text-gray-400";
              break;
            case "booked":
              bg = "bg-pink-500 text-white font-bold";
              break;
            case "free":
              bg = "bg-green-200 text-green-900";
              break;
          }

          return (
            <button
              key={dateStr}
              className={`rounded-full p-2 w-10 h-10 ${bg} ${text} hover:ring-2 hover:ring-pink-500 transition`}
              onClick={() => handleDateClick(date)}
              disabled={status === "past"}
            >
              {dateStr}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-6 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto p-8 relative font-serif text-gray-800">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-2xl text-gray-600 hover:text-red-600 transition"
          aria-label="Close details"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <h2 className="text-4xl font-bold text-pink-600 mb-6 tracking-wide">
          {venue.name}
        </h2>

        <div className="space-y-3 mb-8 text-lg">
          <p><FontAwesomeIcon icon={faMapMarkerAlt} className="text-pink-400 mr-3" /> <strong>Address:</strong> {venue.address}</p>
          <p><FontAwesomeIcon icon={faDollarSign} className="text-pink-400 mr-3" /> <strong>Seat Price:</strong> ${venue.seat_price}</p>
          <p><FontAwesomeIcon icon={faUsers} className="text-pink-400 mr-3" /> <strong>Capacity:</strong> {venue.capacity}</p>
          <p><FontAwesomeIcon icon={faPhoneAlt} className="text-pink-400 mr-3" /> <strong>Phone:</strong> {venue.phone_number}</p>
          <p><FontAwesomeIcon icon={faInfoCircle} className="text-pink-400 mr-3" /> <strong>Status:</strong> {venue.status}</p>
        </div>

        <h3 className="text-2xl font-semibold text-pink-600 mb-2">Booking Calendar</h3>
        {renderCalendarGrid()}

        {selectedDateInfo && (
          <div className="mt-6 p-5 border border-pink-300 rounded-lg bg-pink-50 text-pink-800 shadow-inner">
            <h4 className="font-semibold text-xl mb-2">Booking Info for {selectedDateInfo.date}</h4>
            <p><strong>Booked By:</strong> {selectedDateInfo.bookedBy}</p>
            <p><strong>Seats Booked:</strong> {selectedDateInfo.seats}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VenueDetails;
