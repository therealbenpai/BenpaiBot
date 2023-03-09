const {
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
} = require('discord.js');

module.exports = {
    name: 'unclaimticket',
    data: new ButtonBuilder()
        .setCustomId('unclaimticket')
        .setLabel('Unclaim the Ticket')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('🔓'),
    async execute(client, interaction) {
        const ticketId = interaction.channel.name.split('-')[1]

        const ticketData = (await client.database.getTicketLog(ticketId))

        if (ticketData.ticketStaffID !== interaction.user.id) {
            return interaction.reply({
                content: 'You cannot unclaim a ticket that you did not claim',
                ephemeral: true
            })
        }

        const detailsEmbed = client.configs.embed()
            .setTitle('Ticket #' + ticketId)
            .setDescription('Thank you for opening a ticket. Please be patient while a staff member assists within this ticket.')
            .addFields(
                {
                    name: 'Ticket Type',
                    value: 'Feature Request Report',
                    inline: true
                },
                {
                    name: 'Submitter',
                    value: `${interaction.user}`,
                    inline: true
                },
                {
                    name: 'Claimed By',
                    value: 'None',
                    inline: true
                }
            )

        interaction.message.edit({
            content: `${interaction.user}`,
            embeds: [detailsEmbed],
            components: [new ActionRowBuilder().addComponents(require('./closeTicket').data, require('./claimTicket').data)]
        })

        interaction.reply({
            content: `You have unclaimed ticket ${ticketId}`,
            ephemeral: true
        })

        await client.database.editTicketLog(ticketId, 'ticketStaffID', null)
    }
}