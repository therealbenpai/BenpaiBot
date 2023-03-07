module.exports = {
    triggers: ['ping'],
    args: false,
    execute: async (client, message) => {
        const reply = client.configs.developers.includes(message.author.id) ?
            `Current Ping: ${client.ws.ping}ms` : 'Pong!'
        await message.channel.send(reply);
    }
}