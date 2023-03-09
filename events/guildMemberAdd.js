const { Events } = require('discord.js')

module.exports = {
    name: Events.GuildMemberAdd,
    once: false,
    async execute(client, member) {
        const embed = client.configs.embed()
            .setTitle('Welcome')
            .setDescription(`Welcome to the server, ${member.user.tag}! You are the ${member.guild.memberCount}th member!`)
        await client.channels.cache.get('1079083148333301832').send({
            embeds: [embed]
        })
    }
}