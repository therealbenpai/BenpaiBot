const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'ping',
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    details: {
        description: 'Replies with Pong!',
        usage: '`/ping`'
    },
    async execute(client, interaction) {
        const reply = client.configs.developers.includes(message.author.id) ?
            `Current Ping: ${client.ws.ping}ms` : 'Pong!'
        await interaction.reply(reply);
    }
}