import pool from '../../config/db.js';


const filterVenue = async (req, res) => {
  const { sortBy, order = "desc", search, status, district } = req.query;

  try {
    let query = `
      SELECT 
        v.*, 
        COALESCE(array_agg(i.image_path) FILTER (WHERE i.image_path IS NOT NULL), '{}') AS images
      FROM venue v
      LEFT JOIN images i ON v.id = i.venue_id
      WHERE 1=1
    `;

    const values = [];
    let count = 1;

    // Search by name
    if (search) {
      query += `AND LOWER(v.name) LIKE LOWER($${count})`;
      values.push(`%${search}%`);
      count++;
    }

    // Filter by status
    if (status) {
      query += ` AND v.status = $${count}`;
      values.push(status);
      count++;
    }

    // Filter by district
    if (district) {
      query += ` AND v.district = $${count}`;
      values.push(district);
      count++;
    }

    // Group by venue
    query += ` GROUP BY v.id`;

    //  Sort
    if (sortBy && ["seat_price", "capacity", "district", "status"].includes(sortBy)) {
      const sortOrder = order.toLowerCase() === "desc" ? "DESC" : "ASC";
      query += ` ORDER BY v.${sortBy} ${sortOrder}`;
    }

    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error filtering venue:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default  filterVenue;
