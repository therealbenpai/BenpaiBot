const { Events } = require('discord.js')

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    /**
     * 
     * @param {import('discord.js').Client} client 
     * @param {import('discord.js').BaseInteraction} interaction 
     */
    async execute(client, interaction) {
        const fs = require('fs');
        if (interaction.isChatInputCommand()) {
            const { commandName, options } = interaction;
            // loop through all of the options sent by the user and add them to an array
            const args = [];
            options.data.forEach(option => {
                option.value ? args.push(option.value) : args.push(option.options[0].value)
            });
            // create a triggerLog using the client's database class
            // const logID = await client.database.triggerLog(interaction.user.id, 'command', commandName, args);
            const logID = 0;
            fs.readdirSync('./commands')
                .filter(file => file.endsWith('.js'))
                .forEach(async file => {
                    const command = require(`../commands/${file}`)
                    if (commandName === command.name) {
                        try {
                            await command.execute(client, interaction)
                        } catch (e) {
                            await require('../functions/errorHandling').catchErrors(e, interaction, logID)
                        }
                    }
                })
        } else if (interaction.isButton()) {
            fs.readdirSync('./components/buttons')
                .filter(file => file.endsWith('.js'))
                .forEach(async file => {
                    const button = require(`../components/buttons/${file}`)
                    if (interaction.customId === button.name) {
                        try {
                            button.execute(client, interaction)
                        } catch (e) {
                            await require('../functions/errorHandling').catchErrors(e, interaction)
                        }
                    }
                })
        } else if (interaction.isAnySelectMenu()) {
            if (interaction.isStringSelectMenu()) {
                fs.readdirSync('./components/selectMenus')
                    .filter(file => file.endsWith('.js'))
                    .forEach(async file => {
                        const selectMenu = require(`../components/selectMenus/${file}`)
                        if (interaction.customId === selectMenu.name) {
                            try {
                                selectMenu.execute(client, interaction)
                            } catch (e) {
                                await require('../functions/errorHandling').catchErrors(e, interaction)
                            }
                        }
                    })
            }
        } else if (interaction.isContextMenuCommand()) {
            const { commandName } = interaction;
            fs.readdirSync('./components/contextMenus')
                .filter(file => file.endsWith('.js'))
                .forEach(async file => {
                    const command = await require(`../components/contextMenus/${file}`)
                    if (commandName == command.name) {
                        try {
                            await command.execute(client, interaction)
                        } catch (e) {
                            await require('../functions/errorHandling').catchErrors(e, interaction)
                        }
                    }
                })
        } else {
            interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true
            })
        }
    }
}