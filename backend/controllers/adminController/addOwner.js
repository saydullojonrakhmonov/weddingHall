import bcrypt from 'bcrypt'
import pool from '../../config/db.js';


const createOwner = async (req, res) => {
  const { first_name, last_name, user_name, password } = req.body;

  if (!user_name || !last_name || !first_name || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existing = await pool.query('SELECT * FROM users WHERE user_name = $1', [user_name]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);



    const query = `
      INSERT INTO users (first_name, last_name, user_name, password, role)
      VALUES ($1, $2, $3, $4, 'owner')
      RETURNING *
    `;

    const values = [first_name, last_name, user_name, hashedPassword];

    const result = await pool.query(query, values);
    res.status(201).json({
      message: "Owner created successfully",
      owner: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating owner:", error);
    res.status(500).json({ error });
  }
};


export default createOwner