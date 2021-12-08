import { Db } from "./interface";
import { Pool } from "pg";
import type { PoolConfig } from "pg";

export type PostgresOptions = PoolConfig;

export class Postgres implements Db {
  pool: Pool;
  constructor(config?: PoolConfig) {
    this.pool = new Pool(config);
  }

  async add(guildId: string, req: string, res: string): Promise<void> {
    const client = await this.pool.connect();
    try {
      const alreadyExists = await this.get(guildId, req);
      await client.query("BEGIN");
      await client.query(
        alreadyExists !== undefined
          ? "UPDATE Pairs SET response = $3 WHERE guild_id = $1 AND request = $2"
          : "INSERT INTO Pairs(guild_id, request, response) VALUES($1, $2, $3)",
        [guildId, req, res],
      );
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  async remove(guildId: string, req: string): Promise<void> {
    const alreadyExists = await this.get(guildId, req);
    if (alreadyExists === undefined) throw new Error("Not defined");
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        "DELETE FROM Pairs WHERE guild_id = $1 AND request = $2",
        [guildId, req],
      );
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  async get(guildId: string, req: string): Promise<string | undefined> {
    const result = await this.pool.query(
      "SELECT response FROM Pairs WHERE guild_id = $1 AND request = $2",
      [guildId, req],
    );
    return result.rows[0]?.response;
  }

  async list(guildId: string): Promise<string[]> {
    const result = await this.pool.query(
      "SELECT request, response FROM Pairs WHERE guild_id = $1",
      [guildId],
    );
    return result.rows.map((row) => row.request);
  }
}
