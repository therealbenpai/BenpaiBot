const {
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ChannelType,
    PermissionFlagsBits,
    OverwriteType
} = require('discord.js');

module.exports = {
    name: 'openmod',
    data: new ButtonBuilder()
        .setCustomId('openmod')
        .setLabel('Open a Moderation Ticket')
        .setStyle(ButtonStyle.Primary),
    async execute(client, interaction) {
        const serverSettings = (await client.database.getServerSettings(interaction.guild.id))
        const ticketCategory = interaction.guild.channels.cache.get(serverSettings.ticketCategory)
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
                    id: client.user.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ManageMessages,
                    ],
                    type: OverwriteType.Member
                },
                {
                    id: serverSettings.ticketSupportRoleId,
                    allow: [
                        PermissionFlagsBits.ViewChannel
                    ],
                    type: OverwriteType.Role
                }
            ]
        })

        const ticketChannelID = await client.database.createTicketLog(interaction.user.id, 'mod', ticketChannel.id)

        ticketChannel.setName(`ticket-${ticketChannelID}`)

        const detailsEmbed = client.configs.embed()
            .setTitle('Ticket #' + ticketChannelID)
            .setDescription('Thank you for opening a ticket. Please be patient while a staff member assists within this ticket.')
            .addFields(
                {
                    name: 'Ticket Type',
                    value: 'Moderation Report',
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

        const initalMessage = await ticketChannel.send({
            content: `${interaction.user} <@&${serverSettings.ticketSupportRoleId}>`,
            embeds: [detailsEmbed],
            components: [new ActionRowBuilder().addComponents(require('./closeTicket').data, require('./claimTicket').data)]
        })

        initalMessage.pin()

        interaction.reply({
            content: `Your ticket has been opened at ${ticketChannel}`,
            ephemeral: true
        })
    }
}