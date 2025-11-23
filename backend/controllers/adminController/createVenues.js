import pool from '../../config/db.js';



const createvenue = async (req, res) => {
  const { name, address, seat_price, capacity, phone_number, owner_id, district_id } = req.body;

  if (!name || !address || !seat_price || !phone_number || !owner_id || !district_id) {
    return res.status(400).json({ error: "Missing required fields, error with creating venue" });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const insertVenueQuery = `
      INSERT INTO venue (name, address, seat_price, capacity, phone_number, user_id, district_id, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `;
    const venueValues = [
      name,
      address,
      seat_price,
      capacity,
      phone_number,
      owner_id,
      district_id,
      'approved',
    ];

    const venueResult = await client.query(insertVenueQuery, venueValues);
    const venueId = venueResult.rows[0].id;

    if (req.files && req.files.length > 0) {
      const insertImageQuery = `
        INSERT INTO images (venue_id, image_path) VALUES ($1, $2)
      `;
      for (const file of req.files) {
        await client.query(insertImageQuery, [venueId, file.filename]);
      }
    }

    await client.query('COMMIT');

    res.status(201).json({ message: 'Venue and images created successfully!', venue_id: venueId });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Venue creation failed:', error);
    res.status(500).json({ error: "Internal server error while creating venue and images" });
  } finally {
    client.release();
  }
};

export default  createvenue;
