const { Events } = require('discord.js')
const fs = require('fs');

module.exports = {
    name: Events.MessageUpdate,
    once: false,
    /**
     * 
     * @param {import('discord.js').Client} client 
     * @param {import('discord.js').Message} oldMessage 
     * @param {import('discord.js').Message} newMessage 
     */
    async execute(client, oldMessage, newMessage) {
        if (oldMessage.author.bot) return;
        if (oldMessage.content == newMessage.content) return;
        const messageTriggers = fs.readdirSync('./triggers/message').filter(file => file.endsWith('.js'));
        for (const file of messageTriggers) {
            const trigger = require(`../triggers/message/${file}`);
            const { triggers, execute, args } = trigger;
            for (const phrase of triggers) {
                if (newMessage.content.toLowerCase().startsWith(phrase)) {
                    const contentArgs = newMessage.content.split(' ').slice(1, -1);
                    // const id = await client.database.triggerLog(newMessage.author.id, 'message', phrase, args ? contentArgs : []);
                    const id = 0;
                    try {
                        await execute(client, newMessage, id);
                    } catch (e) {
                        await require('../functions/errorHandling').catchErrors(e, newMessage, id);
                    }
                    return;
                }
            }
        }
    }
}