const { Events } = require('discord.js')

module.exports = {
    name: Events.Error,
    once: false,
    async execute(client, error) {
        await require('../functions/errorHandling').catchErrors(error)
    }
}