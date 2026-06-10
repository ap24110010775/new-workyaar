import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);
const jwtSecret = process.env.JWT_SECRET || 'change-me-in-production';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'workyaar',
  waitForConnections: true,
  connectionLimit: 10,
});

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, database: 'mysql' });
});

app.post('/api/auth/social', async (request, response) => {
  const { provider, providerUserId, role = 'candidate', name, email, avatarUrl } = request.body;

  if (!provider || !providerUserId || !name || !email) {
    return response.status(400).json({ error: 'provider, providerUserId, name, and email are required' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute(
      `INSERT INTO users (provider, provider_user_id, role, name, email, avatar_url)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE role = VALUES(role), name = VALUES(name), email = VALUES(email), avatar_url = VALUES(avatar_url)`,
      [provider, providerUserId, role, name, email, avatarUrl || null],
    );

    const [rows] = await connection.execute(
      'SELECT id, provider, provider_user_id AS providerUserId, role, name, email, avatar_url AS avatarUrl FROM users WHERE provider = ? AND provider_user_id = ? LIMIT 1',
      [provider, providerUserId],
    );

    const user = rows[0];
    await connection.execute('INSERT INTO social_login_events (user_id, provider) VALUES (?, ?)', [user.id, provider]);
    await connection.commit();

    const token = jwt.sign({ userId: user.id, role: user.role }, jwtSecret, { expiresIn: '7d' });

    return response.json({ token, user });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    return response.status(500).json({ error: 'Unable to complete social sign in' });
  } finally {
    connection.release();
  }
});

app.get('/api/me', async (request, response) => {
  const authHeader = request.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) return response.status(401).json({ error: 'Missing token' });

  try {
    const payload = jwt.verify(token, jwtSecret);
    const [rows] = await pool.execute(
      'SELECT id, provider, provider_user_id AS providerUserId, role, name, email, avatar_url AS avatarUrl FROM users WHERE id = ? LIMIT 1',
      [payload.userId],
    );

    if (!rows.length) return response.status(404).json({ error: 'User not found' });

    return response.json({ user: rows[0] });
  } catch {
    return response.status(401).json({ error: 'Invalid token' });
  }
});

app.listen(port, () => {
  console.log(`WorkYaar MySQL backend running on http://localhost:${port}`);
});