import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed, MessagePayload } from "discord.js";
import { addSubCommandBuilder } from "./add";
import { removeSubCommandBuilder } from "./remove";

const commandName = "help";
export const helpSubCommandBuilder = new SlashCommandSubcommandBuilder()
  .setName(commandName)
  .setDescription("Show help for ping bot");

export const isHelpCommand = (interaction: CommandInteraction): boolean =>
  interaction.options.getSubcommand() === commandName;

export const helpCommandHandler = async (
  interaction: CommandInteraction,
): Promise<void> => {
  await interaction.reply(
    new MessagePayload(interaction, {
      embeds: [
        new MessageEmbed({
          title: "ping usage",
          description: `For example, I will say "pong"(response message) when you say "ping"(request message). And, you can custom request/response pairs with the following commands.`,
          color: "GREYPLE",
          fields: [
            addSubCommandBuilder,
            removeSubCommandBuilder,
            helpSubCommandBuilder,
          ].map((cmd) => ({
            name: `/ping ${cmd.name}`,
            value: cmd.description,
          })),
        }),
      ],
    }),
  );
};
