import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { add } from "../db";

export const name = "add";
export const description = "Add request:response pair (e.g. ping:pong)";
const reqOptionName = "request";
const resOptionName = "response";
export const addSubCommandBuilder = new SlashCommandSubcommandBuilder()
  .setName(name)
  .setDescription(description)
  .addStringOption((opt) =>
    opt
      .setName(reqOptionName)
      .setDescription("request keyword")
      .setRequired(true)
  )
  .addStringOption((opt) =>
    opt
      .setName(resOptionName)
      .setDescription("response message")
      .setRequired(true)
  );

export const isAddCommand = (interaction: CommandInteraction): boolean =>
  interaction.options.getSubcommand() === name;

export const addCommandHandler = async (
  interaction: CommandInteraction,
): Promise<void> => {
  const req = interaction.options.getString(reqOptionName, true);
  const res = interaction.options.getString(resOptionName, true);
  await add(interaction.guildId, req, res);
  await interaction.reply("Successfully added!");
};
