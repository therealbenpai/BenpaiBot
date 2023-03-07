const { ApplicationCommandType, ContextMenuCommandBuilder } = require('discord.js');

module.exports = {
    name: 'User Details',
    data: new ContextMenuCommandBuilder()
        .setName('User Details')
        .setType(ApplicationCommandType.User),
    async execute(client, interaction) {
        return await interaction.reply(`User: ${interaction.targetUser}\nID: ${interaction.targetUser.id}`);
    }
}