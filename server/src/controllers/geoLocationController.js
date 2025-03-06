import db from "../index.js";


export const geolocation = (req, res) => {
  const { latitude, longitude } = req.body;
  const userId =  req.userId; 
  const sessionId = req.sessionId; 

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  const ipAddress = req.ip;
  const browserInfo = req.headers['user-agent'];

  const checkSessionQuery = `
    SELECT id FROM sessions
    WHERE user_id = ? AND id = ? AND status = 'active'
    LIMIT 1
  `;
  
  db.get(checkSessionQuery, [userId, sessionId], (err, session) => {
    if (err) {
      return res.status(500).json({ error: 'Database error while checking active session' });
    }

    if (session) {
        console.log("it to updateeeeeeee");
        
      const updateSessionQuery = `
        UPDATE sessions
        SET latitude = ?, longitude = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      db.run(updateSessionQuery, [latitude, longitude, session.id], function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to update geolocation' });
        }
        return res.status(200).json({ message: 'Geolocation updated successfully' });
      });
    } else {

        const insertSessionQuery = `
        INSERT INTO sessions (user_id, ip_address, latitude, longitude, browser_info)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.run(insertSessionQuery, [userId, ipAddress, latitude, longitude, browserInfo], function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to save geolocation' });
        }
        return res.status(200).json({ message: 'Geolocation saved successfully', sessionId: this.lastID });
      });
    }
  });
};

export const fetchGeolocations = (req, res) => {
    const userId = req.userId; 
    const sessionId = req.sessionId; 
  
    const fetchSessionsQuery = `
      SELECT id, ip_address, latitude, longitude, browser_info, status
      FROM sessions
      WHERE user_id = ? AND status = 'active'
    `;
  
    db.all(fetchSessionsQuery, [userId], (err, sessions) => {
      if (err) {
        return res.status(500).json({ error: 'Database error while fetching sessions' });
      }
  
      if (sessions.length > 0) {
        const activeDevices = sessions.map(session => ({
          id: session.id,
          ip: session.ip_address,
          browser: session.browser_info,
          status: session.status,
          lat: session.latitude,
          lng: session.longitude,
        }));
  
        return res.status(200).json(activeDevices);
      } else {
        return res.status(404).json({ message: 'No active sessions found' });
      }
    });
  };
  