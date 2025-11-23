import pool from '../../config/db.js';

const getVenueById = async (req, res) => {
  const venueId = req.params.id;

  try {
    const query = `
      SELECT * FROM venue
      WHERE id = $1;
    `;
    const result = await pool.query(query, [venueId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Venue not found" });
    }

    res.status(200).json({
      message: "Venue retrieved successfully",
      venue: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching venue:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default  getVenueById;