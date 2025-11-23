import pool from '../../config/db.js';

const getOwnVenues = async (req, res) => {
  const ownerId = req.user.id; 
  try {
    const query = `
      SELECT * FROM venue
      WHERE owner_id = $1
      ORDER BY created_at DESC;
    `;
    const result = await pool.query(query, [ownerId]);

    res.status(200).json({
      venue: result.rows,
    });
  } catch (error) {
    console.error("Error fetching owner's venue:", error);
    res.status(500).json({ error: "Failed to fetch venue" });
  }
};

export default  getOwnVenues;
