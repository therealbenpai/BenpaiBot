const { ApplicationCommandType, ContextMenuCommandBuilder } = require('discord.js');

module.exports = {
    name: 'User Details',
    data: new ContextMenuCommandBuilder()
        .setName('User Details')
        .setType(ApplicationCommandType.User),
        /**
         * 
         * @param {import('discord.js').Client} client 
         * @param {import('discord.js').UserContextMenuCommandInteraction} interaction 
         * @returns 
         */
    async execute(client, interaction) {
        const { targetUser: user, targetMember: member} = interaction
        const roles = member.roles.cache.map(role => role.toString()).join(' ');
        const presence = member.presence.activities[0];
        const embed = client.configs.embed()
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
            .setThumbnail(user.displayAvatarURL())
            .setTitle('User Information')
            .addFields(
                { name: 'User ID', value: user.id },
                { name: 'Nickname', value: member.nickname || 'None' },
                { name: 'Account Created', value: client.timeManager.time('US',user.createdAt) },
                { name: 'Joined Server', value: client.timeManager.time('US',member.joinedAt) },
                { name: 'Presence', value: presence ? presence.name : 'None' },
                { name: 'Roles', value: roles || 'None' }
            )
        return await interaction.reply({ embeds: [embed] });
    }
}