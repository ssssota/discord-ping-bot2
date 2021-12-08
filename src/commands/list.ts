import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed, MessagePayload } from "discord.js";
import { db } from "../db";

export const name = "list";
export const description = "List all request keywords";
export const listSubCommandBuilder = new SlashCommandSubcommandBuilder()
  .setName(name)
  .setDescription(description);

export const isListCommand = (interaction: CommandInteraction): boolean =>
  interaction.options.getSubcommand() === name;

export const listCommandHandler = async (
  interaction: CommandInteraction,
): Promise<void> => {
  const list = await db.list(interaction.guildId);
  await interaction.reply(
    list.length === 0 ? "Not registered" : list.join(", "),
  );
};
