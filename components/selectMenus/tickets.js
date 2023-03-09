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
                description: 'Opens a moderation ticket'
            },
            {
                label: 'Feature Request Ticket',
                value: 'feature',
                description: 'Opens a feature request ticket'
            },
            {
                label: 'Bug Report Ticket',
                value: 'bug',
                description: 'Opens a bug report ticket'
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
