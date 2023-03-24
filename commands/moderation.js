const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'moderate',
    data: new SlashCommandBuilder()
        .setName('moderate')
        .setDescription('Moderation commands')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addSubcommand(subcommand =>
            subcommand
                .setName('ban')
                .setDescription('Bans a user')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to ban')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('The reason for the ban')
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('kick')
                .setDescription('Kicks a user')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to kick')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('The reason for the kick')
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('warn')
                .setDescription('Warns a user')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to warn')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('The reason for the warn')
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('mute')
                .setDescription('Mutes a user')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to mute')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('The reason for the mute')
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('unmute')
                .setDescription('Unmutes a user')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to unmute')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('The reason for the unmute')
                        .setRequired(false)
                )
        ),
    details: {
        description: 'Replies with Pong!',
        usage: '`/ping`'
    },
    /**
     * 
     * @param {import('discord.js').Client} client 
     * @param {import('discord.js').ChatInputCommandInteraction} interaction 
     */
    async execute(client, interaction) {
        const member = interaction.options.getMember('user');
        const reasonSubmission = interaction.options.getString('reason');
        const moderator = interaction.user;
        const reason = `{moderator.tag} (${moderator.id}) ${reasonSubmission ? `for ${reasonSubmission}` : ''}}`
        switch (interaction.options.getSubcommand()) {
            case 'ban':
                await member.ban({ reason: reason });
                await interaction.reply(`Banned ${member.user.tag} ${reasonSubmission ? `for ${reasonSubmission}` : ''}}`);
                break;
            case 'kick':
                await member.kick(reason);
                await interaction.reply(`Kicked ${member.user.tag} ${reasonSubmission ? `for ${reasonSubmission}` : ''}}`);
                break;
            case 'warn':
                member.send(`You have been warned in ${interaction.guild.name} ${reasonSubmission ? `for ${reasonSubmission}` : ''}}`);
                await interaction.reply(`Warned ${member.user.tag} ${reasonSubmission ? `for ${reasonSubmission}` : ''}}`);
                break;
            case 'mute':
                member.disableCommunicationUntil()
                await interaction.reply(`Muted ${member.user.tag} ${reasonSubmission ? `for ${reasonSubmission}` : ''}}`);
                break;
            case 'unmute':
                await interaction.reply(`Unmuted ${member.user.tag} ${reasonSubmission ? `for ${reasonSubmission}` : ''}}`);
                break;
        }
    }
}