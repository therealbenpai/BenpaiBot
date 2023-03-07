module.exports = {
    triggers: ['ping'],
    args: false,
    async execute(client, message) {
        if (!client.configs.developers.includes(message.author.id)) return await message.reply('Pong!');
        return await message.reply(`Current Ping: ${client.ws.ping}ms`);
    }
}