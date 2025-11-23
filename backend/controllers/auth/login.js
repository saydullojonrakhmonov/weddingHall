import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../../config/db.js";
import dotenv from "dotenv";
dotenv.config();

const login = async (req, res) => {
  try {
    const { user_name, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE user_name = $1",
      [user_name]
    );

    if (result.rows.length === 0) {
      console.log("No user found for username:", user_name);
      return res.status(404).json({ message: "Invalid username or password" });
    }

    const users = result.rows[0];

    const cleanPassword = password.trim();
    const cleanHash = users.password.trim();

    // Compare passwords
    const passwordMatch = await bcrypt.compare(cleanPassword, cleanHash);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: users.id,
        username: users.user_name,
        role: users.role,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: users.id,
        firstname: users.first_name,
        lastname: users.last_name,
        username: users.user_name,
        role: users.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Internal server error");
  }
};

export default login;
