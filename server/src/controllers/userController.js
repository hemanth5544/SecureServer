import db from "../index.js";
import path from 'path';


export const user= async (req, res) => {
    db.get(
      'SELECT id, email, twoFactorEnabled ,profileImage, name FROM users WHERE id = ?',
      [req.user.userId],
      (err, user) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        console.log(err)
        res.json(user);
      }
    );
  };


  export const getLastActivity = (req, res) => {
    console.log(req.user.userId);
  
    db.get('SELECT browser_info, status,ip_address FROM sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1 OFFSET 1', [req.user.userId], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Server error while retrieving last activity from sessions' });
      }
  
      if (!row) {
        return res.status(200).json({ msg: 'No session found for the user' });
      }
  
      return res.json({ lastActivity: row });
    });
  };
  
  export const getActiveSessions = (req, res) => {
    console.log(req.user.userId);
  
    db.all('SELECT  * FROM sessions WHERE user_id = ? AND status = ? ORDER BY created_at DESC', 
      [req.user.userId, 'active'], (err, rows) => {
        if (err) {
          return res.status(500).json({ error: 'Server error while retrieving active sessions' });
        }
  
        if (rows.length === 0) {
          return res.status(404).json({ error: 'No active sessions found for the user' });
        }
  
        return res.json({ activeSessions: rows });
      });
  };
  
  
  export const updateUserProfile = (req, res) => {
    const { name } = req.body;
    const profileImage = req.file ? `/uploads/profiles/${req.file.filename}` : null;  
  
    const userId = req.userId;  
    console.log(userId,"userIDDDDDDD")

    console.log('Request body:', req.body);  
    console.log('Profile image path:', profileImage);  
  
    if (!name && !profileImage) {
      return res.status(400).json({ message: 'No profile data to update' });
    }
  
    const query = `UPDATE users SET name = ?, profileImage = ? WHERE id = ?`;

    const pathQuery = `SELECT profileImage FROM users WHERE id = ?`;

  
    const params = [name, profileImage, userId];
  
    db.run(query, params, function (err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to update profile', error: err });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'Profile updated successfully' });
    });
  };
  