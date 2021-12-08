import { SlashCommandBuilder } from "@discordjs/builders";

export type Command = ReturnType<SlashCommandBuilder["toJSON"]>;
