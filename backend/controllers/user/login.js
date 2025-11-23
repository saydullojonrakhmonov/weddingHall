import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from '../../config/db.js';
import dotenv from 'dotenv'
dotenv.config();

const loginUser = async (req, res) => {
  const { user_name, password } = req.body;

  try {
    const query = "SELECT * FROM \"user\" WHERE user_name = $1";
    const result = await pool.query(query, [user_name]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.user_name, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        user_name: user.user_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export default loginUser