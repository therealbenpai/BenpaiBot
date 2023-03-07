const { SlashCommandBuilder } = require('@discordjs/builders');

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
        if (!client.configs.developers.includes(interaction.user.id)) return await interaction.reply('Pong!');
        return await interaction.reply(`Current Ping: ${client.ws.ping}ms`);
    }
}