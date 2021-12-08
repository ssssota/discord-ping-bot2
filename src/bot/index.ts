import { Client, Intents } from "discord.js";
import { commandHandler, isPingCommand } from "../commands";
import { get } from "../db";
import { createLogger } from "./log";
import { getRequestCandidates } from "./utils";

export const launchBot = (token: string, logging = true) =>
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
      if (!message.inGuild() || message.guildId === null) return;
      const requestCandidates = getRequestCandidates(message.cleanContent);
      log("request candidates", requestCandidates);
      for (const requestCandidate of requestCandidates) {
        const response = await get(message.guildId, requestCandidate);
        if (response) {
          log(`response found ${requestCandidate}:${response}`);
          await message.channel.send(response);
        }
      }
    });

    log("starting...");

    await client.login(token);
  });
