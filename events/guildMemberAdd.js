const { Events, EmbedBuilder } = require('discord.js')

module.exports = {
    name: Events.GuildMemberAdd,
    once: false,
    async execute(client, member) {
        const embed = new EmbedBuilder()
            .setTitle('Welcome')
            .setDescription(`Welcome to the server, ${member}! You are the ${member.guild.memberCount}th member!`)
            .setColor('#ff0000')
            .setTimestamp()
        await member.send({
            embeds: [embed]
        })
    }
}