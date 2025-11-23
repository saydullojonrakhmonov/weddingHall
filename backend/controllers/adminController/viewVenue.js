import pool from '../../config/db.js';
import dotenv from 'dotenv'
dotenv.config();

const viewVenue = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT 
        v.id AS venue_id,
        v.name,
        v.address,
        v.seat_price,
        v.capacity,
        v.phone_number,
        v.status,
        v.created_at,
        v.updated_at,
        v.owner_id,
        v.district_id,
        COALESCE(array_agg(i.image_path) FILTER (WHERE i.image_path IS NOT NULL), '{}') AS images
      FROM venue v
      LEFT JOIN images i ON v.id = i.venue_id
      WHERE v.id = $1
      GROUP BY v.id
      ORDER BY v.id;
    `;

    const values = [id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Venue not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching venue:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default  viewVenue;
