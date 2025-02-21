import jwt from 'jsonwebtoken';
import db from '../index.js'
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'mrbean');
    req.user = verified;
    req.userId=verified.userId
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

export const checkSessionStatus = (req, res, next) => {
  const sessionId = req.headers['x-session-id']; 
  
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID is required in the headers' });
  }

  const query = 'SELECT status FROM sessions WHERE id = ?';
  
  db.get(query, [sessionId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Error checking session status' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (row.status === 'inactive') {
      return res.status(400).json({ error: 'Session is inactive' });
    }

    next();
  });
};
