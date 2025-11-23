import pool from '../../config/db.js';

const createVenueByOwner = async (req, res) => {
  const { name, address, seat_price, capacity, phone_number, owner_id, district_id } = req.body;

  if (!name || !address || !seat_price || !capacity || !phone_number || !owner_id || !district_id) {
    return res.status(400).json({ error: "Missing required fields to create venue" });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const insertVenueQuery = `
      INSERT INTO venue (name, address, seat_price, capacity, phone_number, status, owner_id, district_id)
      VALUES ($1, $2, $3, $4, $5, 'pending', $6, $7)
      RETURNING id;
    `;
    const venueValues = [name, address, seat_price, capacity, phone_number, owner_id, district_id];

    const venueResult = await client.query(insertVenueQuery, venueValues);
    const venueId = venueResult.rows[0].id;

    if (req.files && req.files.length > 0) {
      const insertImageQuery = `INSERT INTO images (venue_id, image_path) VALUES ($1, $2)`;
      for (const file of req.files) {
        await client.query(insertImageQuery, [venueId, file.filename]);
      }
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: "Venue created successfully and is pending approval 🎉",
      venue_id: venueId,
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error creating venue:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};

export default  createVenueByOwner;
