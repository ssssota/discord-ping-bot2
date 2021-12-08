export interface Db {
  add(guildId: string, request: string, response: string): Promise<void>;
  remove(guildId: string, request: string): Promise<void>;
  get(guildId: string, request: string): Promise<string | undefined>;
  list(guildId: string): Promise<string[]>;
}
