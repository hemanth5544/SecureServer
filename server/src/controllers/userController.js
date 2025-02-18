import db from "../index.js";

export const user= async (req, res) => {
    db.get(
      'SELECT id, email, twoFactorEnabled FROM users WHERE id = ?',
      [req.user.userId],
      (err, user) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        res.json(user);
      }
    );
  };