CREATE TABLE Pairs(
  guild_id  TEXT,
  request   TEXT,
  response  TEXT,
  PRIMARY KEY(guild_id, request)
);
