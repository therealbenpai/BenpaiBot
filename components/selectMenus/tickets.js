const { StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
    name: 'tickets',
    data: new StringSelectMenuBuilder({
        custom_id: 'tickets',
        placeholder: 'Select a ticket type'
    })
        .setOptions({
                label: 'Moderation Ticket',
                value: 'mod',
                description: 'Gives you the red role'
            },
            {
                label: 'Feature Request Ticket',
                value: 'feature',
                description: 'Gives you the blue role'
            },
            {
                label: 'Bug Report Ticket',
                value: 'bug',
                description: 'Gives you the green role'
            })
            .setMaxValues(1),
    /**
     * 
     * @param {import('discord.js').Client} client 
     * @param {import('discord.js').StringSelectMenuInteraction} interaction 
     */
    async execute(client, interaction) {
        const openButtons = {
            mod: require('../buttons/openModTicket').data,
            feature: require('../buttons/openFeatureTicket').data,
            bug: require('../buttons/openBugTicket').data
        }
        interaction.reply({
            components: [
                new ActionRowBuilder()
                    .addComponents(openButtons[interaction.values[0]])
            ],
            content: 'Select a button to open a ticket',
            ephemeral: true
        })
    }
}
