import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: '.env' })

export default defineConfig({
  schema: './db/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NEON_DATABASE_URL
  },
  // out: "./migrations"
})