
import dotenv from 'dotenv'
dotenv.config()
import app from './app.js'
import { sql } from './config/db.js'


import { createClient } from "redis";

export const redisclient = createClient({
  url: process.env.REDIS_URL
});


redisclient.connect().then(() => console.log("connected to redis")).catch((Err) => console.log("Failed to connect redis", Err))


async function initDb() {
  try {
    // ENUM type
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_type WHERE typname = 'user_role'
        ) THEN
          CREATE TYPE user_role AS ENUM ('jobseeker', 'recruiter');
        END IF;
      END $$;
    `;

    // USERS table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone_number VARCHAR(20) NOT NULL,
        role user_role NOT NULL,
        bio TEXT,
        resume VARCHAR(255),
        resume_public_id VARCHAR(255),
        profile_pic VARCHAR(255),
        profile_pic_public_id VARCHAR(255),
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        subscription TIMESTAMPTZ
      );
    `;

    // SKILLS table
    await sql`
      CREATE TABLE IF NOT EXISTS skills (
        skill_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
      );
    `;

    // USER_SKILLS (many-to-many)
    await sql`
      CREATE TABLE IF NOT EXISTS user_skills (
        user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        skill_id INTEGER NOT NULL REFERENCES skills(skill_id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, skill_id)
      );
    `;

    console.log("✅ Database initialized successfully");
  } catch (err) {
    console.error("❌ Database initialization failed:", err);
  }
}
console.log('.........',process.env.PORT)
initDb().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Auth service is running on http://localhost:5000`)
  })
})
