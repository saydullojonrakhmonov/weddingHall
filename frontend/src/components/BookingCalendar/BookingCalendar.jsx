import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from '../../utils/axiosInstance';
import { isSameDay, isBefore } from "date-fns";

const BookingCalendar = ({ venueId, selectedDate, onDateChange }) => {
  const [bookedDates, setBookedDates] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`user/venue/${venueId}/bookings`);
        setBookedDates(res.data.bookings);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      }
    };

    fetchBookings();
  }, [venueId]);

  const isBooked = (date) =>
    bookedDates.some((b) => isSameDay(new Date(b.reservation_date), date));

  return (
    <DatePicker
      selected={selectedDate}
      onChange={onDateChange}
      minDate={new Date()}
      inline
      dayClassName={(date) => {
        if (isBefore(date, new Date())) return "bg-gray-300 text-gray-600";
        if (isBooked(date)) return "bg-red-500 text-white font-bold";
        if (isSameDay(date, selectedDate)) return "bg-green-500 text-white";
        return "";
      }}
    />
  );
};

export default BookingCalendar;
