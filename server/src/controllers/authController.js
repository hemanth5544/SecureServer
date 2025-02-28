import bcrypt from "bcryptjs";
import db from "../index.js";
import { authenticator } from "otplib";
import { generateToken,sendEmail } from "../util.js";
import useragent from "useragent";

//FIXME: Add salt while hasihing and add more sha algo
export const signup = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword],
      (err) => {
        if (err) {
          return res.status(400).json({ error: "Email already exists" });
        }
        res.json({ message: "User created successfully." });

        const subject = "Signup Notification";
        const name ="hemanth"

        sendEmail(email, subject, name,email).catch((emailError) => {
          console.error("Error sending email:", emailError);
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password, token } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) return res.status(500).json({ error: "Server error" });
    if (!user) return res.status(400).json({ error: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ error: "Invalid password" });

    if (user.twoFactorEnabled) {
      if (!token) return res.status(400).json({ error: "2FA token required" });

      const isValid = authenticator.verify({
        token,
        secret: user.twoFactorSecret,
      });

      if (!isValid) return res.status(400).json({ error: "Invalid 2FA token" });
    }

    db.get("SELECT * FROM notifications WHERE user_id = ?", [user.id], async (err, notificationRecord) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (notificationRecord && notificationRecord.email_notifications_enabled) {
        
        const subject = "Login Notification";
        const name ="hemanth"

        await sendEmail(email, subject, name,email).catch((emailError) => {
          console.error("Error sending email:", emailError);
        });
      }
    });
    

    const ipAddress =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.ip;

    const agent = useragent.parse(req.headers["user-agent"]);
    const browserInfo = ` ${agent.os.family} ${agent.family} `;
    console.log(browserInfo,agent);

    const sessionInsertQuery = `
      INSERT INTO sessions (user_id, ip_address, browser_info, status) 
      VALUES (?, ?, ?, ?)
    `;

    db.run(
      sessionInsertQuery,
      [user.id, ipAddress, browserInfo, "active"],
      function (err) {
        if (err) {
          return res.status(500).json({ error: "Error creating session" });
        }

        const jwtToken = generateToken(user.id);
        res.json({ token: jwtToken, sessionId: this.lastID });
      }
    );
  });
};

export const logout = async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) return res.status(400).json({ error: "Session ID required" });

  const updateSessionQuery = `
    UPDATE sessions
    SET status = 'inactive', updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(updateSessionQuery, [sessionId], function (err) {
    if (err) {
      return res.status(500).json({ error: "Error logging out" });
    }

    if (this.changes === 0) {
      return res
        .status(400)
        .json({ error: "Session not found or already inactive" });
    }

    res.json({ message: "Logged out successfully" });
  });
};
export const logoutAll = async (req, res) => {
  const userId=req.user.userId

  if (!userId) return res.status(400).json({ error: "Session ID required" });

  const updateSessionQuery = `
    UPDATE sessions
    SET status = 'inactive', updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `;

  db.run(updateSessionQuery, [userId], function (err) {
    if (err) {
      return res.status(500).json({ error: "Error logging out" });
    }
    res.json({ message: "Logged out all devices successfully" });
  });
};
