import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DB_URL) {
    throw new Error("DATABASE_URL not set");
}

export const sql = neon(process.env.DB_URL as string);
