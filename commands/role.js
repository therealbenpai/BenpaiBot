const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'role',
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Manage roles')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a role to yourself')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('The role to add')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove a role from yourself')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('The role to remove')
                        .setRequired(true)
                )
        ),
    details: {
        description: 'Replies with Pong!',
        usage: '`/role [add/remove] [role]`'
    },
    /**
     * 
     * @param {import('discord.js').Client} client 
     * @param {import('discord.js').ChatInputCommandInteraction} interaction 
     */
    async execute(client, interaction) {
        switch (interaction.options.getSubcommand()) {
            case 'add':
                const roleToAdd = interaction.options.getRole('role');
                await interaction.member.roles.add(roleToAdd);
                await interaction.reply(`Added role ${roleToAdd.name} to ${interaction.member.displayName}`);
                break;
            case 'remove':
                const roleToRemove = interaction.options.getRole('role');
                await interaction.member.roles.remove(roleToRemove);
                await interaction.reply(`Removed role ${roleToRemove.name} from ${interaction.member.displayName}`);
                break;
        }
    }
}