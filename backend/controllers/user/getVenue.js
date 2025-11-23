import pool from '../../config/db.js';

const getVenue = async (req, res) => {
  const { id } = req.params;

  try {
    const venueQuery = `SELECT * FROM wedding_hall WHERE id = $1 AND status = 'approved'`;
    const wedding_hallResult = await pool.query(venueQuery, [id]);

    if (venueResult.rows.length === 0) {
      return res.status(404).json({ error: 'Wedding hall not found' });
    }

    const wedding_hall =wedding_hallResult.rows[0];

    const imageQuery = `SELECT image_path FROM images WHERE wedding_hall_id = $1`;
    const imageResult = await pool.query(imageQuery, [id]);
    const images = imageResult.rows;

    res.json({
      wedding_hall,
      images,
    });
  } catch (error) {
    console.error('Error fetching venue:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export default  getVenue;
