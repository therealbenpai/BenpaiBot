const { ButtonBuilder, ButtonStyle } = require('discord.js');

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
        */

        const ticketId = interaction.channel.name.split('-')[1]

        // confirm that the channel is a ticket channel
        if (!interaction.channel.name.startsWith('ticket-')) {
            interaction.reply({
                content: 'This channel is not a ticket channel',
                ephemeral: true
            })
            return
        }

        // confirm that the ticket is not already marked as closed (if so, return)        
        // TODO: impliment the function to check if the ticket is closed within the database class

        // close the ticket in the database
        await client.database.editTicketLog(ticketId, 'closed', true)

        // delete the channel
        await interaction.channel.delete()

        // DM the user that the ticket has been closed (if possible, if not, just log it)
        // TODO: impliment the function to get the user id of the creator of the ticket within the database class
        // while we wait, try to DM the user who is closing the ticket
        if (interaction.member.isCommunicationDisabled()) {
            console.log('Unable to DM the user who closed the ticket')
        }
        else {
            interaction.member.send({
                content: `Your ticket has been closed. If you have any questions, please feel free to open a new ticket.`
            })
        }
    }
}