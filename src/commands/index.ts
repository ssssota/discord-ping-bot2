import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { CacheType, CommandInteraction, Interaction } from "discord.js";
import { addCommandHandler, addSubCommandBuilder, isAddCommand } from "./add";
import {
  helpCommandHandler,
  helpSubCommandBuilder,
  isHelpCommand,
} from "./help";
import {
  isListCommand,
  listCommandHandler,
  listSubCommandBuilder,
} from "./list";
import {
  isRemoveCommand,
  removeCommandHandler,
  removeSubCommandBuilder,
} from "./remove";

const commandName = "ping";
const command = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription("Set response for ping bot")
  .addSubcommand(addSubCommandBuilder)
  .addSubcommand(removeSubCommandBuilder)
  .addSubcommand(helpSubCommandBuilder)
  .addSubcommand(listSubCommandBuilder)
  .toJSON();

export const registerCommands = (clientId: string, token: string) =>
  new REST({ version: "9" })
    .setToken(token)
    .put(Routes.applicationCommands(clientId), { body: [command] });

export const isPingCommand = (
  interaction: Interaction,
): interaction is CommandInteraction<CacheType> =>
  interaction.isCommand() && interaction.commandName === commandName;

export const commandHandler = async (interaction: CommandInteraction) => {
  if (isAddCommand(interaction)) await addCommandHandler(interaction);
  if (isRemoveCommand(interaction)) await removeCommandHandler(interaction);
  if (isHelpCommand(interaction)) await helpCommandHandler(interaction);
  if (isListCommand(interaction)) await listCommandHandler(interaction);
};
