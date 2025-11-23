import pool from '../../config/db.js';
import dotenv from 'dotenv'
dotenv.config();

const updateVenue = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    address,
    seat_price,
    capacity,
    phone_number,
    status,
  } = req.body;

  if (!name || !address || !status) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    const query = `
      UPDATE venue
      SET name = $1,
          address = $2,
          seat_price = $3,
          capacity = $4,
          phone_number = $5,
          status = $6,
          updated_at = NOW()
      WHERE id = $7
      RETURNING *;
    `;

    const values = [
      name,
      address,
      seat_price,
      capacity,
      phone_number,
      status,
      id,
    ];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    res.status(200).json({
      message: 'Venue updated successfully',
      updated_venue: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating venue:', error);
    res.status(500).json({ error: 'Internal server error while updating venue.' });
  }
};

export default  updateVenue;
