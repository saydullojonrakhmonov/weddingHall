import pool from '../../config/db.js';


const getVenueBookings = async (req, res) => {
  try {
    const venueId = req.params.id;
    const query = `
      SELECT b.reservation_date, b.guest_amount, u.first_name, u.last_name
      FROM booking b
      JOIN users u ON b.user_id = u.id
      WHERE b.venue_id = $1;
    `;
    const { rows } = await pool.query(query, [venueId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

export default  getVenueBookings;
