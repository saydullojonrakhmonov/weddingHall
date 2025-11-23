import pool from '../../config/db.js';


const deleteVenue = async (req, res) => {
  const { id } = req.params;

  try {
    // Check venue 
    const result = await pool.query(`SELECT * FROM venue WHERE id = $1`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Venue not found" });
    }

    // Delete venue
    await pool.query(`DELETE FROM venue WHERE id = $1`, [id]);
    res.status(200).json({ message: "Venue deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export default  deleteVenue;
