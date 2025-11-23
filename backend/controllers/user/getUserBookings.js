import pool from '../../config/db.js';

const getUserBookings = async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const query = `
      SELECT 
        b.*,
        v.name AS venue_name,
        v.address AS venue_location,
        v.capacity,
        v.phone_number,
        v.seat_price
      FROM booking b
      JOIN venue v ON b.venue_id = v.id
      WHERE b.user_id = $1
      ORDER BY b.reservation_date DESC
    `;

    const { rows } = await pool.query(query, [user_id]);
    res.json({ bookings: rows });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

export default  getUserBookings;
