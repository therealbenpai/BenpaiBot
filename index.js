const { Client, Partials, GatewayIntentBits, ActivityType, PresenceUpdateStatus, EmbedBuilder } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
require('dotenv').config();
const { TOKEN: token } = process.env;

const Database = require('./functions/connection');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction,
        Partials.User,
        Partials.ThreadMember
    ],
    presence: {
        status: PresenceUpdateStatus.Online,
        activities: [
            {
                type: ActivityType.Watching,
                name: 'The Server',
            }
        ]
    }
});

client.configs = {
    prefix: '!',
    developers: require('./config/developers.json').developers,
    footer: {
        text: 'Made by Benpai',
        iconURL: 'https://bsh.daad.wtf/discord/user/957352586086875216/avatar'
    },
    color: 0xff7777,
    embed: () => new EmbedBuilder().setFooter(client.configs.footer).setColor(client.configs.color).setTimestamp(),
}
client.timeManager = require('./functions/time');
client.database = new Database();

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(client, ...args));
    } else {
        client.on(event.name, (...args) => event.execute(client, ...args));
    }
}

const interactions = [];

console.log('Registering commands...')

const commandFiles = fs
    .readdirSync('./commands')
    .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    console.log(`Registering command: ${command.name}`)
    interactions.push(command.data.toJSON());
}

console.log('Registering context menus...')

const contextMenuFiles = fs
    .readdirSync('./components/contextMenus')
    .filter(file => file.endsWith('.js'));

for (const file of contextMenuFiles) {
    const contextMenu = require(`./components/contextMenus/${file}`);
    console.log(`Registering context menu: ${contextMenu.name}`)
    interactions.push(contextMenu.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationCommands('1079128318051356742'), { body: interactions })
    .then(_ => console.log('Successfully registered all commands and context menu parts.'))
    .catch(console.error);

client.login(token);