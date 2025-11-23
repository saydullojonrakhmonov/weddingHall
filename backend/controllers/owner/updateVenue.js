import pool from '../../config/db.js';

const updateVenue = async (req, res) => {
  const venueId = req.params.id;
  const { name, address, seat_price, phone_number, district_id } = req.body;

  if (!name || !address || !seat_price || !phone_number || !district_id) {
    return res.status(400).json({ error: "Missing required fields for update" });
  }

  try {
    const query = `
      UPDATE venues
      SET name = $1,
          address = $2,
          seat_price = $3,
          phone_number = $4,
          district_id = $5
      WHERE id = $6
      RETURNING *;
    `;

    const values = [name, address, seat_price, phone_number, district_id, venueId];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Venue not found" });
    }

    res.status(200).json({
      message: "Venue updated successfully",
      venue: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating venue:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default  updateVenue;