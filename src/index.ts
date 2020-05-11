import DiscordBot from 'dbsc';
import ShellQuote from 'shell-quote';
import Discord from 'discord.js';
import Configstore from 'configstore';
const packagejson = require('../package.json');

const data = new Configstore(packagejson.name);
const bot = new DiscordBot(process.env.TOKEN || '');

bot.client.on('ready', () => console.log('i\'m ready.'));
bot.client.on('error', console.error);

const commands = {
  help: {
    command: '/ping:help',
    description: 'このヘルプを表示します。',
    usage: '/ping:help'
  },
  add: {
    command: '/ping:add',
    description: 'メッセージと応答を登録します。',
    usage: '/ping:add message reply'
  },
  remove: {
    command: '/ping:rm',
    description: '登録されたメッセージと応答を削除します。',
    usage: '/ping:rm message'
  },
  list: {
    command: '/ping:list',
    description: '登録されたメッセージの一覧を表示します。',
    usage: '/ping:list'
  },
  json: {
    command: '/ping:json',
    description: 'JSON形式で一覧を出力します。',
    usage: '/ping:json',
    private: true
  }
};
const helpMessage = {
  embed: {
    title: 'ping',
    description: '登録したメッセージに登録された応答を返します。',
    fields: [ {
      name: commands.help.usage,
      value: commands.help.description
    }, {
      name: commands.add.usage,
      value: commands.add.description
    }, {
      name: commands.remove.usage,
      value: commands.remove.description
    }, {
      name: commands.list.usage,
      value: commands.list.description
    } ],
    footer: {
      text: `version ${process.env.npm_package_version}`
    }
  }
};

bot.on('command', async (command, msg) => {
  if (msg.author.bot) return;
  if (typeof(command[0]) === 'string' && command[0].startsWith('/ping')) {
    switch (command[0]) {
      case commands.help.command:
        await msg.channel.send(helpMessage);
        break;
      case commands.add.command:
        await addCommand(command, msg);
        break;
      case commands.remove.command:
        await removeCommand(command, msg);
        break;
      case commands.list.command:
        await listCommands(command, msg);
        break;
      case commands.json.command:
        await jsonCommands(command, msg);
        break;
      default: break;
    }
  } else {
    const reply = data.get(`${getGuildId(msg)}.${msg.cleanContent}`) as string | undefined;
    if (!reply) return;
    if (reply.match(/^https?:\/\/(cdn|media)\.discordapp\.(com|net)\/attachments\/.*\/.*\.(jpg|png|gif|JPG|PNG|GIF|jpeg|JPEG|svg|SVG|bmp|BMP|heic|HEIC)$/)) {
      await msg.channel.send({ files: [ reply ] });
    } else {
      await msg.channel.send(reply);
    }
  }
});
bot.run();

async function addCommand(command: ShellQuote.ParseEntry[], msg: Discord.Message) {
  if (typeof(command[1]) !== 'string' || typeof(command[2]) !== 'string') {
    await msg.channel.send(`***Usage*** \`${commands.add.usage}\``);
    return;
  }
  const key = `${getGuildId(msg)}.${command[1]}`;
  if (data.has(key)) {
    msg.channel.send('Sorry, already exists.');
    return;
  }
  data.set(key, command[2]);
  await msg.channel.send(`"${command[1]}" was added!`);
}
async function removeCommand(command: ShellQuote.ParseEntry[], msg: Discord.Message) {
  if (typeof(command[1]) !== 'string') {
    await msg.channel.send(`***Usage*** \`${commands.add.usage}\``);
    return;
  }
  const key = `${getGuildId(msg)}.${command[1]}`;
  if (!data.has(key)) {
    msg.channel.send('Sorry, I don\'t know this message.');
    return;
  }
  data.delete(key);
  await msg.channel.send(`"${command[1]}" was removed!`);
}
async function listCommands(command: ShellQuote.ParseEntry[], msg: Discord.Message) {
  const commandSet = data.get(getGuildId(msg));
  const messages = Object.keys(commandSet).join(', ');
  if (messages) await msg.channel.send(messages);
}
async function jsonCommands(command: ShellQuote.ParseEntry[], msg: Discord.Message) {
  const commandSet = data.get(getGuildId(msg));
  if (commandSet) await msg.channel.send('```'+JSON.stringify(commandSet)+'```');
}

function getGuildId(msg: Discord.Message) {
  return (msg.channel instanceof Discord.TextChannel)? msg.channel.guild.id: msg.channel.id;
}