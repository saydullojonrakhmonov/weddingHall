import pool from '../../config/db.js';

const getAllBookings = async (req, res) => {
  const ownerId = req.user.id; 

  const { sort = 'reservation_date', order = 'asc' } = req.query;

  const validSortColumns = {
    reservation_date: 'b.reservation_date',
    venue_name: 'v.name',
    district: 'd.name',
    status: 'b.status',
  };

  const sortColumn = validSortColumns[sort] || 'b.reservation_date';
  const sortOrder = order === 'desc' ? 'DESC' : 'ASC';

  try {
    const query = `
      SELECT 
        b.id,
        b.reservation_date,
        b.status,
        b.guest_amount,
        b.first_name,
        b.phone_number,
        v.name AS venue_name,
        d.name AS district_name
      FROM booking b
      INNER JOIN venues v ON b.venue_id = v.id
      INNER JOIN district d ON v.district_id = d.id
      WHERE v.owner_id = $1
      ORDER BY ${sortColumn} ${sortOrder}
    `;

    const result = await pool.query(query, [ownerId]);

    res.status(200).json({ bookings: result.rows });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default  getAllBookings;
