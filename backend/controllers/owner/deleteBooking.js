import pool from '../../config/db.js';

const deleteBooking = async (req, res) => {
  const bookingId = req.params.id;

  try {
    const checkQuery = `
      SELECT b.id, v.user_id
      FROM bookings b
      JOIN venue v ON b.venue_id = v.id
      WHERE b.id = $1
    `;
    const checkResult = await pool.query(checkQuery, [bookingId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }


    const deleteQuery = `DELETE FROM bookings WHERE id = $1`;
    await pool.query(deleteQuery, [bookingId]);

    res.status(200).json({ message: "Booking successfully deleted" });
  } catch (error) {
    console.error("Error deleting booking by owner:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export default  deleteBooking