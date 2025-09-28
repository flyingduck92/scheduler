import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { profiles } from './profilesSchema'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique(),
  password: text('password'),
  ProfileId: uuid('ProfileId')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' })
  ,
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date())
})
