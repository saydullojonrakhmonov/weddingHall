import pool from '../../config/db.js';
import bcrypt from 'bcrypt'

const registerUser = async (req, res) => {
  const { first_name, last_name, user_name, password } = req.body;

  if (!first_name || !last_name || !user_name || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const existing = await pool.query(`SELECT * FROM users WHERE user_name = $1`, [user_name]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = `
      INSERT INTO users (first_name, last_name, user_name, password, role)
      VALUES ($1, $2, $3, $4, 'user') RETURNING *;
    `;
    const values = [first_name, last_name, user_name, hashedPassword];
    const { rows } = await pool.query(insertQuery, values);

    res.status(201).json({ message: "User registered successfully!", user: rows[0] });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default  registerUser ;
