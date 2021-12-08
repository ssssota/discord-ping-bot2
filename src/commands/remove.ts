import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { db } from "../db";

export const name = "remove";
export const description = "Remove request:response pair (e.g. ping:pong)";
const reqOptionName = "request";
export const removeSubCommandBuilder = new SlashCommandSubcommandBuilder()
  .setName(name)
  .setDescription(description)
  .addStringOption((opt) =>
    opt
      .setName(reqOptionName)
      .setDescription("request keyword")
      .setRequired(true),
  );

export const isRemoveCommand = (interaction: CommandInteraction): boolean =>
  interaction.options.getSubcommand() === name;

export const removeCommandHandler = async (
  interaction: CommandInteraction,
): Promise<void> => {
  const req = interaction.options.getString(reqOptionName, true);
  await db.remove(interaction.guildId, req);
  await interaction.reply(`Successfully removed! (${req})`);
};
