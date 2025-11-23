import pool from '../../config/db.js';

const getVenue = async (req, res) => {
  const { id } = req.params;

  try {
    const venueQuery = `SELECT * FROM venue WHERE id = $1 AND status = 'approved'`;
    const venueResult = await pool.query(venueQuery, [id]);

    if (venueResult.rows.length === 0) {
      return res.status(404).json({ error: 'Wedding hall not found' });
    }

    const venue =venueResult.rows[0];

    const imageQuery = `SELECT image_path FROM images WHERE venue_id = $1`;
    const imageResult = await pool.query(imageQuery, [id]);
    const images = imageResult.rows;

    res.json({
      venue,
      images,
    });
  } catch (error) {
    console.error('Error fetching venue:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export default  getVenue;
