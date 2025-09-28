import { sql } from 'drizzle-orm'
import { pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core'

export const profiles = pgTable(
  'profiles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    username: text('username'),
    fullname: text('fullname'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date())
  },
  (table) => [
    uniqueIndex('unique_nonempty_username')
      .on(table.username)
      .where(sql`${table.username} <> ''`)
  ])