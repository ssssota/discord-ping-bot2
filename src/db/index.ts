import { Postgres } from "./postgres";

export const db = new Postgres({
  host: "postgres",
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});
