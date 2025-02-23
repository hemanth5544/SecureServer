import jwt from 'jsonwebtoken';
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