const { Events } = require('discord.js')

module.exports = {
    name: Events.GuildMemberAdd,
    once: false,
    async execute(client, member) {
        const embed = client.configs.embed()
            .setTitle('Welcome')
            .setDescription(`Welcome to the server, ${member.user.tag}! You are the ${member.guild.memberCount}th member!`)
        const serverSettings = await client.database.getServerSettings(member.guild.id)
        await client.channels.cache.get(serverSettings.welcomeChannelId)
            .send({
                embeds: [embed]
            })
    }
}