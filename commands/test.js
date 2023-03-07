const { SlashCommandBuilder, ActionRowBuilder } = require('discord.js');
const {data: component} = require('../components/selectMenus/colorRoles')

module.exports = {
    name: 'test',
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Test command'),
    details: {
        description: 'Command used for testing purposes',
        usage: '`/test`'
    },
    async execute(client, interaction) {
        await interaction.reply({
            components: [
                new ActionRowBuilder().addComponents(component)
            ],
            ephemeral: true
        })
    }
}