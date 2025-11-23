import pool from '../../config/db.js';

const approveVenue = async (req, res) => {
  const { id } = req.params;

  try {
    //  Check if venue exists
    const result = await pool.query(
      `SELECT 
         v.*, 
         d.name 
       FROM venue v
       LEFT JOIN district d ON v.district_id = d.id
       WHERE v.id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    //  Update status to 'approved'
    const update = await pool.query(
      `UPDATE venue
       SET status = 'approved',
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    return res.status(200).json({
      message: 'Venue approved successfully.',
      approved_venue: update.rows[0],
    });
  } catch (error) {
    console.error('Error approving venue:', error);
    return res.status(500).json({ error: 'Failed to approve venue.' });
  }
};

export default approveVenue;
