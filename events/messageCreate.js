const { EmbedBuilder, Events } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(client, message) {
        if (message.author.bot) return;
        const messageTriggers = fs.readdirSync('./triggers/message').filter(file => file.endsWith('.js'));
        for (const file of messageTriggers) {
            const { execute, triggers, args } = require(`../triggers/message/${file}`);
            for (const phrase of triggers) {
                if (message.content.toLowerCase().includes(phrase)) {
                    const contentArgs = message.content.split(' ');
                    contentArgs.shift();
                    client.database.triggerLog(message.author.id, 'message', phrase, args ? contentArgs : []);
                    return await execute(client, message);
                }
            }
        }
        if (message.channel.isDMBased()) {
            const logs = client.channels.cache.get('1079230181841051819');
            const embed = new EmbedBuilder()
                .setTitle('New ModMail Message')
                .setDescription(message.content)
                .setAuthor({
                    name: message.author.tag,
                    iconURL: message.author.avatarURL({ size: 256 })
                })
                .setTimestamp()
                .setFooter({
                    text: message.author.id
                });
            await logs.send({ embeds: [embed] });
        }
        // detect if the message replies to the bot
        if (message.mentions.has(client.user) && message.type == 19) {
            await message.channel.messages.fetch(message.reference.messageId)
                .then(async msg => {
                    if (msg.embeds.length !== 1) return;
                    if (!msg.embeds[0].footer) return;
                    const embed = msg.embeds[0];
                    const sendID = embed.footer.text;
                    (await client.users.cache.get(sendID).createDM(true)).send(
                        {
                            content: `From ${message.author} ${(client.configs.developers.includes(message.author.id)) ? '[**DEVELOPER**]' : ''}\n\n>>> ${message.content}`
                        }
                    )
                });
        }
    }
}