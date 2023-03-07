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
        const presence = member.presence.activities[0];
        const embed = client.configs.embed()
            .setAuthor(user.tag, user.displayAvatarURL())
            .setThumbnail(user.displayAvatarURL())
            .setTitle('User Information')
            .addFields(
                { name: 'User ID', value: user.id, inline: true },
                { name: 'Nickname', value: member.nickname || 'None', inline: true },
                { name: 'Account Created', value: user.createdAt.toUTCString(), inline: true },
                { name: 'Joined Server', value: member.joinedAt.toUTCString(), inline: true },
                { name: 'Presence', value: presence ? presence.name : 'None', inline: true },
                { name: 'Roles', value: roles || 'None', inline: true }
            )
        await interaction.reply({ embeds: [embed] });
    }
}