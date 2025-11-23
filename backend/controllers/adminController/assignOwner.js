import pool from '../../config/db.js';


// Assign owner to a venue
const assignOwner = async (req, res) => {
  const venueId = req.params.id;
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "Missing owner user_id" });
  }

  try {
// select owners
    const userCheck = await pool.query(

      `SELECT * FROM users WHERE id = $1 AND role = 'owner'`,
      [user_id]
    );

    if (userCheck.rowCount === 0) {
      return res.status(404).json({ error: "Owner user not found or not an owner" });
    }

// update venue owner
    const result = await pool.query(
      'UPDATE venues SET owner_id = $1 WHERE id = $2 RETURNING *',
      [user_id, venueId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Venue not found" });
    }

    res.status(200).json({
      message: "Owner assigned to venue successfully",
      venue: result.rows[0],
    });
  } catch (error) {
    console.error("Error assigning owner:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
 
export  default  assignOwner;
