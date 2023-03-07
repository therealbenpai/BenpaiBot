const { Events } = require('discord.js')
const fs = require('fs');

module.exports = {
    name: Events.MessageUpdate,
    once: false,
    async execute(client, oldMessage, newMessage) {
        if (oldMessage.author.bot) return;
        if (oldMessage.content == newMessage.content) return;
        const messageTriggers = fs.readdirSync('./triggers/message').filter(file => file.endsWith('.js'));
        for (const file of messageTriggers) {
            const trigger = require(`../triggers/message/${file}`);
            const { triggers, execute, args } = trigger;
            for (const phrase of triggers) {
                if (newMessage.content.toLowerCase().includes(phrase)) {
                    const contentArgs = newMessage.content.split(' ');
                    contentArgs.shift();
                    client.database.triggerLog(newMessage.author.id, 'message', phrase, args ? contentArgs : []);
                    await execute(client, newMessage);
                    return;
                }
            }
        }
    }
}