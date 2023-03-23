const {
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
} = require('discord.js');

module.exports = {
    name: 'claimticket',
    data: new ButtonBuilder()
        .setCustomId('claimticket')
        .setLabel('Claim the Ticket')
        .setStyle(ButtonStyle.Success)
        .setEmoji('🔑'),
    async execute(client, interaction) {
        const serverSettings = (await client.database.getServerSettings(interaction.guild.id))
        if (!interaction.member.roles.cache.has(serverSettings.ticketSupportRoleId)) return interaction.reply({ content: 'You do not have permission to claim tickets.', ephemeral: true })

        const ticketId = interaction.channel.name.split('-')[1]

        const detailsEmbed = client.configs.embed()
            .setTitle(`Ticket #${ticketId}`)
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
                    value: `${interaction.user}`,
                    inline: true
                }
            )


        interaction.message.edit({
            content: `${interaction.user}`,
            embeds: [detailsEmbed],
            components: [new ActionRowBuilder().addComponents(require('./closeTicket').data, require('./unclaimTicket').data)]
        })

        interaction.reply({
            content: `You have claimed ticket ${ticketId}`,
            ephemeral: true
        })

        await client.database.editTicketLog(ticketId, 'ticketStaffID', interaction.user.id)
    }
}