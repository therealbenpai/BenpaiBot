const { ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'button1',
    data: new ButtonBuilder()
        .setCustomId('button1')
        .setLabel('Button 1')
        .setStyle(ButtonStyle.Primary),
    async execute(client, interaction) {
        await interaction.reply('Button 1 was clicked!');
    }
}