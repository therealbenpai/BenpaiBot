const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    name: 'userinfo',
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Get information about a user')
        .addUserOption(option => option.setName('user').setDescription('The user to get information about')),
    details: {
        description: 'Get information about a user',
        usage: '`/userinfo [user]`'
    },
    /**
     * 
     * @param {import('discord.js').Client} client 
     * @param {import('discord.js').ChatInputCommandInteraction} interaction 
     */
    async execute(client, interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const member = interaction.options.getMember('user') || interaction.member;
        const roles = member.roles.cache.map(role => role.toString()).join(' ');
        const presence = member?.presence?.activities[0] || null;
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
        await interaction.reply({ embeds: [embed] });
    }
}