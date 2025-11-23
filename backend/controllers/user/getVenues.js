import pool from '../../config/db.js';

const getAllVenue = async (req, res) => {
  const { price, capacity, district, search } = req.query;

  try {
    let query = ` SELECT 
  v.id,
  v.name,
  v.address,
  v.seat_price,
  v.capacity,
  v.phone_number,
  v.status,
  d.name AS district,
  (
    SELECT i.image_path
    FROM images i
    WHERE i.venue_id = v.id
    ORDER BY i.id
    LIMIT 1
  ) AS preview_image
FROM venue v
LEFT JOIN district d ON v.district_id = d.id
WHERE v.status = 'approved'`;
    let params = [];
    let conditions = [];

    if (price) {
      conditions.push(`seat_price <= $${params.length + 1}`);
      params.push(price);
    }
    if (capacity) {
      conditions.push(`capacity >= $${params.length + 1}`);
      params.push(capacity);
    }
    if (district) {
      conditions.push(`district = $${params.length + 1}`);
      params.push(district);
    }
    if (search) {
      conditions.push(`LOWER(name) LIKE $${params.length + 1}`);
      params.push(`%${search.toLowerCase()}%`);
    }

    if (conditions.length > 0) {
      query += ' AND ' + conditions.join(' AND ');
    }

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export default  getAllVenue;
