import pool from '../../config/db.js';


const getUnapprovedVenue = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        v.id, 
        v.name, 
        v.address, 
        v.seat_price, 
        v.capacity, 
        v.phone_number, 
        v.owner_id, 
        v.district_id, 
        d.name AS district_name,   
        u.first_name, 
        u.last_name
      FROM venue v
      JOIN "user" u ON v.owner_id = u.id
      LEFT JOIN district d ON v.district_id = d.id  
      WHERE v.status = 'pending'
      ORDER BY v.id DESC
    `);
    

    res.status(200).json({ venue: result.rows });
  } catch (error) {
    console.error('Error fetching unapproved venue:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default  getUnapprovedVenue;
