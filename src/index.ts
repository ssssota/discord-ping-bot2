import { exit } from "process";
import { launchBot } from "./bot";
import { registerCommands } from "./commands";

const main = async () => {
  const clientId = process.env.CLIENT_ID;
  if (!clientId) throw new Error("Invalid discord token");
  const token = process.env.DISCORD_TOKEN;
  if (!token) throw new Error("Invalid discord token");

  await registerCommands(clientId, token);
  await launchBot(clientId, token);
};

main()
  .then(() => exit(0))
  .catch((e) => {
    console.error(e);
    exit(0);
  });
