import { timestamp, varchar } from "drizzle-orm/pg-core";

export const timestamps = {
  updated_at: timestamp("updated_at"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  deleted_at: timestamp("deleted_at"),
};

export const address = {
  street: varchar({ length: 255 }),
  number: varchar({ length: 255 }),
  neighborhood: varchar({ length: 255 }),
  state: varchar({ length: 255 }),
  city: varchar({ length: 255 }),
  cep: varchar({ length: 255 }),
};
