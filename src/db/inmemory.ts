import { Db } from "./interface";

type InternalDb = {
  [guildId: string]: { [req: string]: string | undefined } | undefined;
};

export class InMemory implements Db {
  private db: InternalDb = {};

  async add(guildId: string, req: string, res: string): Promise<void> {
    this.db[guildId] = {
      ...(this.db[guildId] ?? {}),
      [req]: res,
    };
  }
  async remove(guildId: string, req: string): Promise<void> {
    this.db[guildId] = {
      ...(this.db[guildId] ?? {}),
      [req]: undefined,
    };
  }
  async get(guildId: string, req: string): Promise<string | undefined> {
    if (req === "ping") return "pong";
    const guild = this.db[guildId];
    if (typeof guild === "undefined") return;
    return guild[req];
  }
  async list(guildId: string): Promise<string[]> {
    const guild = this.db[guildId];
    if (typeof guild === "undefined") return [];
    return Object.keys(guild);
  }
}
