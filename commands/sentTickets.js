const { SlashCommandBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
    name: 'sendtickets',
    data: new SlashCommandBuilder()
        .setName('sendtickets')
        .setDescription('Sent the tickets to the ticket category'),
    details: {
        description: 'Sent the tickets to the ticket category',
        usage: '`/sendtickets`'
    },
    async execute(client, interaction) {
        const ticketChannel = interaction.channel
        const ticketSelectMenu = require('../components/selectMenus/tickets').data
        ticketChannel.send({
            content: 'Select a ticket to open', components: [
                new ActionRowBuilder()
                    .addComponents(ticketSelectMenu)
            ]
        })
        interaction.reply({
            content: 'Sent the tickets to the ticket category',
            ephemeral: true
        })
    }
}