type Db = {
  [guildId: string]: { [req: string]: string | undefined } | undefined;
};

const db: Db = {};

export const add = async (
  guildId: string,
  req: string,
  res: string,
): Promise<void> => {
  db[guildId] = {
    ...(db[guildId] ?? {}),
    [req]: res,
  };
};

export const del = async (guildId: string, req: string): Promise<void> => {
  const guild = db[guildId];
  if (typeof guild === "undefined") return;
  delete guild[req];
};

export const get = async (
  guildId: string,
  req: string,
): Promise<string | undefined> => {
  if (req === "ping") return "pong";
  const guild = db[guildId];
  if (typeof guild === "undefined") return;
  return guild[req];
};
