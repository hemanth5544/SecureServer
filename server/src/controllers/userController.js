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


  
  export const updateUserProfile = (req, res) => {
    const { name } = req.body;
    const profileImage = req.file ? `/uploads/profiles/${req.file.filename}` : null;  
  
    const userId = req.userId;  
    console.log(userId,"userIDDDDDDD")

    console.log('Request body:', req.body);  // Log the request body (name and profile image)
    console.log('Profile image path:', profileImage);  
  
    if (!name && !profileImage) {
      return res.status(400).json({ message: 'No profile data to update' });
    }
  
    const query = `UPDATE users SET name = ?, profileImage = ? WHERE id = ?`;

    const pathQuery = `SELECT profileImage FROM users WHERE id = ?`;

    console.log('SQL Query for current image:', pathQuery);    
    console.log('SQL Query:', query);  // Log the query for debugging
    // console.log('SQL Params:', params);  // Log the query params for debugging
  
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
  