const { StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    name: 'colorroles',
    data: new StringSelectMenuBuilder({
        custom_id: 'colorroles',
        placeholder: 'Select an color'
    })
        .setOptions({
                label: 'Red',
                value: 'red',
                description: 'Gives you the red role'
            },
            {
                label: 'Blue',
                value: 'blue',
                description: 'Gives you the blue role'
            },
            {
                label: 'Green',
                value: 'green',
                description: 'Gives you the green role'
            }),
    async execute(client, interaction) {
        const colors = [
            '1079174444137857024', // Red
            '1079174525570273461', // Blue
            '1079174494989586543' // Green
        ]
        await interaction.member.roles.remove(colors[0])
        await interaction.member.roles.remove(colors[1])
        await interaction.member.roles.remove(colors[2])
        switch (interaction.values[0]) {
            case 'red':
                await interaction.member.roles.add(colors[0])
                await interaction.reply({
                    content: 'You are now red',
                    ephemeral: true
                })
                break;
            case 'blue':
                await interaction.member.roles.add(colors[1])
                await interaction.reply({
                    content: 'You are now blue',
                    ephemeral: true
                })
                break;
            case 'green':
                await interaction.member.roles.add(colors[2])
                await interaction.reply({
                    content: 'You are now green',
                    ephemeral: true
                })
                break;
        }
    }
}
