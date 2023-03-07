const { Events } = require('discord.js')

module.exports = {
    name: Events.Error,
    once: false,
    execute: async (_, error) => await require('../functions/errorHandling').catchErrors(error)
}