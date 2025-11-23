import pool from '../../config/db.js';
import dotenv from 'dotenv'
dotenv.config();

const getAllVenues = async (req, res) => {
  try {
    const {
      search = '',
      sortField = 'name',
      sortOrder = 'asc',
      status,
      district
    } = req.query;


    const allowedSortFields = ['seat_price', 'capacity', 'district', 'status', 'name'];
    const order = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    const field = allowedSortFields.includes(sortField) ? sortField : 'name';

    const filters = [];
    const values = [];

    if (search) {
      values.push(`%${search.toLowerCase()}%`);
      filters.push(`LOWER(v.name) LIKE $${values.length}`);
    }

    if (status) {
      values.push(status);
      filters.push(`v.status = $${values.length}`);
    }

    if (district) {
      values.push(district);
      filters.push(`d.name = $${values.length}`);
    }

    const whereClause = filters.length > 0 ? `AND ${filters.join(' AND ')}` : '';


    const query = `
      SELECT 
        v.id,
        v.name,
        v.address,
        v.seat_price,
        v.capacity,
        v.phone_number,
        v.status,
        d.name AS district,
        (u.first_name || ' ' || u.last_name) AS owner_full_name,
        (
          SELECT i.image_path
          FROM images i
          WHERE i.venue_id = v.id
          ORDER BY i.id
          LIMIT 1
        ) AS preview_image
      FROM venue v
      LEFT JOIN district d ON v.district_id = d.id
      LEFT JOIN users u ON v.owner_id = u.id
      WHERE v.status IN ('approved', 'pending', 'booked')
      ${whereClause}
      ORDER BY ${field} ${order};
    `;

    const { rows } = await pool.query(query, values);
    res.status(200).json(rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error!' });
  }
};


export default  getAllVenues;
