import { Client, Intents } from "discord.js";
import { commandHandler, isPingCommand, registerCommands } from "../commands";
import { db } from "../db";
import { createLogger } from "./log";
import { getRequestCandidates } from "./utils";

export const launchBot = (clientId: string, token: string, logging = true) =>
  new Promise(async () => {
    const log = logging ? createLogger("BOT") : () => {};
    const client = new Client({
      intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS],
      partials: ["CHANNEL"],
    });

    client.once("ready", () => log("Ready"));
    client.on("interactionCreate", async (interaction) => {
      if (isPingCommand(interaction)) {
        try {
          log("ping command called");
          await commandHandler(interaction);
          log("ping command successfully finished");
        } catch (e) {
          log("ping command failed", e);
        }
      }
    });
    client.on("messageCreate", async (message) => {
      log(`message comming "${message.cleanContent}"`);
      if (!message.inGuild() || message.guildId === null || message.author.bot)
        return;
      const requestCandidates = getRequestCandidates(message.cleanContent);
      log("request candidates", requestCandidates);
      for (const requestCandidate of requestCandidates) {
        const response = await db.get(message.guildId, requestCandidate);
        if (response) {
          log(`response found ${requestCandidate}:${response}`);
          await message.channel.send(response);
        }
      }
    });

    client.on("guildCreate", async () => {
      await registerCommands(clientId, token);
    });

    log("starting...");

    await client.login(token);
  });
