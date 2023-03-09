const {
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ChannelType,
    PermissionFlagsBits,
    OverwriteType
} = require('discord.js');

module.exports = {
    name: 'openbug',
    data: new ButtonBuilder()
        .setCustomId('openbug')
        .setLabel('Open a Bug Report Ticket')
        .setStyle(ButtonStyle.Primary),
    async execute(client, interaction) {
        const ticketCategory = interaction.guild.channels.cache.get('1083435173980405942')
        const ticketChannel = await interaction.guild.channels.create({
            type: ChannelType.GuildText,
            parent: ticketCategory,
            name: `ticket-pendingID`,
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    deny: [
                        PermissionFlagsBits.ViewChannel
                    ],
                    type: OverwriteType.Role
                },
                {
                    id: interaction.user.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel
                    ],
                    type: OverwriteType.Member
                },
                {
                    id: '1079230268658958517',
                    allow: [
                        PermissionFlagsBits.ViewChannel
                    ],
                    type: OverwriteType.Role
                }
            ]
        })

        const ticketChannelID = await client.database.createTicketLog(interaction.user.id, 'bug', ticketChannel.id)

        ticketChannel.setName(`ticket-${ticketChannelID}`)
        ticketChannel.send({
            content: `Thank you for opening a ticket. Please be patient while we review your ticket.`,
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        require('./closeTicket').data
                    )
            ]
        })
        interaction.reply({
            content: `Your ticket has been opened at ${ticketChannel}`,
            ephemeral: true
        })
    }
}