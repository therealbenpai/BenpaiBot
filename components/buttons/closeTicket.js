const { ButtonBuilder, ButtonStyle } = require('discord.js');
const transcripter = require('discord-html-transcripts');

module.exports = {
    name: 'closeticket',
    data: new ButtonBuilder()
        .setCustomId('closeticket')
        .setLabel('Close the Ticket')
        .setStyle(ButtonStyle.Danger),
    /**
     * 
     * @param {import('discord.js').Client} client 
     * @param {import('discord.js').ButtonInteraction} interaction 
     * @returns 
     */
    async execute(client, interaction) {
        /*
        Ticket Channel Standards:
        - Ticket Channel Naming Scheme: ticket-<ticket id>
        - Database connection function to close: client.database.editTicketLog(<ticket id>, 'closed', true)

        steps to preform in this function:
        - confirm that the channel is a ticket channel
        - confirm that the ticket is not already marked as closed (if so, return)
        - close the ticket in the database
        - delete the channel
        - DM the user that the ticket has been closed (if possible, if not, just log it)
        - Submit a log for the closed ticket in the channel with the id of '1083471975013429369' with the following data:
            Embed:
            - Ticket ID
            - Ticket Type
            - Ticket Submitter
            - Ticket Staff
            - Ticket Closed By
            - Ticket Closed At
            Attachment:
            - Transcript of the ticket
        */

        const serverSettings = await client.database.getServerSettings(interaction.guild.id);

        const ticketId = interaction.channel.name.split('-')[1];

        // confirm that the channel is a ticket channel
        if (!interaction.channel.name.startsWith('ticket-')) {
            interaction.reply({
                content: 'This channel is not a ticket channel',
                ephemeral: true
            })
            return
        };

        const ticketData = (await client.database.getTicketLog(ticketId));

        // confirm that the ticket is not already marked as closed (if so, return)        
        if (ticketData.closed) {
            return interaction.reply({
                content: 'This ticket is already closed',
                ephemeral: true
            })
        };

        // close the ticket in the database
        await client.database.editTicketLog(ticketId, 'closed', true);

        const transcript = await transcripter.createTranscript(interaction.channel, {
            saveImages: true,
            poweredBy: false,
            filename: `ticket-${ticketId}.transcript`,
            footerText: 'Created by Benpai <|=❤️=|> Saved {number} message{s}'
        })
        
        // delete the channel
        interaction.channel.delete();

        // DM the user that the ticket has been closed (if possible, if not, just log it)
        (await client.users.fetch(ticketData.ticketUserID)).send({
            content: 'Your ticket has been closed'
        }).catch(err => {
            console.log(err)
        });

        // Submit a log for the closed ticket in the channel with the id of '1083471975013429369' with the following data:
        // Embed:
        // - Ticket ID
        // - Ticket Type
        // - Ticket Submitter
        // - Ticket Staff
        // - Ticket Closed By
        // - Ticket Closed At
        // Attachment:
        // - Transcript of the ticket
        const logChannel = interaction.guild.channels.cache.get(serverSettings.ticketLogChannelId);

        let type;

        switch (ticketData.ticketReason) {
            case 'bug':
                type = 'Bug Report';
                break;
            case 'feature':
                type = 'Feature Request';
                break;
            case 'mod':
                type = 'Moderation Request';
                break;
        }

        const logEmbed = client.configs.embed()
            .setTitle(`Ticket #${ticketId}`)
            .setDescription('A ticket has been closed')
            .addFields(
                {
                    name: 'Ticket Type',
                    value: type,
                    inline: true
                },
                {
                    name: 'Ticket Submitter',
                    value: `<@${ticketData.ticketUserID}>`,
                },
                {
                    name: 'Ticket Staff',
                    value: `<@${ticketData.ticketStaffID}>`,
                },
                {
                    name: 'Ticket Closed By',
                    value: `<@${interaction.user.id}>`,
                },
                {
                    name: 'Ticket Closed At',
                    value: client.timeManager.time(),
                }
            )

        logChannel.send({
            embeds: [logEmbed],
            files: [transcript]
        })
    }
}