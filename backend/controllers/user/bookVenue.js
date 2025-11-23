import pool from '../../config/db.js';

const bookVenue = async (req, res) => {
  const { id } = req.params;
  const {
    guest_amount,
    reservation_date,
    phone_number,
    user_id
  } = req.body;

  if (!guest_amount || !reservation_date || !phone_number || !user_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const userResult = await pool.query('SELECT first_name, last_name FROM users WHERE id = $1', [user_id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { first_name, last_name } = userResult.rows[0];

    const existing = await pool.query(
      'SELECT * FROM booking WHERE venue_id = $1 AND reservation_date = $2',
      [id, reservation_date]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Date already booked' });
    }

    const query = `
      INSERT INTO booking (venue_id, guest_amount, reservation_date, status, first_name, last_name, phone_number, user_id)
      VALUES ($1, $2, $3, 'pending', $4, $5, $6, $7)
      RETURNING *
    `;

    const { rows } = await pool.query(query, [
      id,
      guest_amount,
      reservation_date,
      first_name,
      last_name,
      phone_number,
      user_id
    ]);

    res.status(201).json({ message: 'Booking created', booking: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Booking failed' });
  }
};

export default  bookVenue;
