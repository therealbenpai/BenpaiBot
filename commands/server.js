const { SlashCommandBuilder, ChannelType, EmbedBuilder } = require('discord.js')

new EmbedBuilder().set

module.exports = {
    name: 'server',
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Get information about different parts of the server')
        .addSubcommand(
            subcommand => subcommand
                .setName('roles')
                .setDescription('Get information about the server\'s roles')
        ) // roles
        .addSubcommand(
            subcommand => subcommand
                .setName('channels')
                .setDescription('Get information about the server\'s channels')
        ) // channels
        .addSubcommand(
            subcommand => subcommand
                .setName('emojis')
                .setDescription('Get information about the server\'s emojis')
        ) // emojis
        .addSubcommand(
            subcommand => subcommand
                .setName('members')
                .setDescription('Get information about the server\'s members')
        ) // members
        .addSubcommand(
            subcommand => subcommand
                .setName('general')
                .setDescription('Get information about the server\'s general information')
        ) // general (member count, server creation date, etc.)
    ,
    details: {
        description: 'Get information about different parts of the server',
        usage: '`/server [roles/channels/emojis/members/general]`'
    },
    /**
     * 
     * @param {import('discord.js').Client} client 
     * @param {import('discord.js').ChatInputCommandInteraction} interaction 
     */
    async execute(client, interaction) {
        const embed = client.configs.embed()
            .setTitle('Server Information')
            .setThumbnail(interaction.guild.iconURL())
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
        const subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
            case 'roles':
                const roles = interaction.guild.roles.cache.map(role => role.toString()).join('\n');
                embed.setDescription('Roles')
                    .addFields(
                        {
                            name: 'Roles',
                            value: roles || 'None'
                        },
                        {
                            name: 'Role Count',
                            value: interaction.guild.roles.cache.size.toString()
                        });
                break;
            case 'channels':
                embed.setDescription('Channels')
                    .addFields(
                        {
                            name: 'Total Channel Count',
                            value: interaction.guild.channels.cache.filter(channel => channel.type !== ChannelType.GuildCategory).size.toString()
                        },
                        {
                            name: 'Text Channels',
                            value: interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText).size.toString()
                        },
                        {
                            name: 'Voice Channels',
                            value: interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).size.toString()
                        },
                        {
                            name: 'Category Channels',
                            value: interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildCategory).size.toString()
                        })
                break;
            case 'emojis':
                embed.setDescription('Emojis')
                    .addFields(
                        {
                            name: 'Total Emoji Count',
                            value: interaction.guild.emojis.cache.size.toString()
                        },
                        {
                            name: 'Animated Emojis',
                            value: interaction.guild.emojis.cache.filter(emoji => emoji.animated).size.toString()
                        },
                        {
                            name: 'Static Emojis',
                            value: interaction.guild.emojis.cache.filter(emoji => !emoji.animated).size.toString()
                        })
                break;
            case 'members':
                embed.setDescription('Members')
                    .addFields(
                        {
                            name: 'Member Count',
                            value: interaction.guild.memberCount.toString()
                        },
                        {
                            name: 'Humans',
                            value: interaction.guild.members.cache.filter(member => !member.user.bot).size.toString()
                        },
                        {
                            name: 'Bots',
                            value: interaction.guild.members.cache.filter(member => member.user.bot).size.toString()
                        })
                break;
            case 'general':
                embed.setDescription('General')
                    .addFields(
                        {
                            name: 'Member Count',
                            value: interaction.guild.memberCount.toString()
                        },
                        {
                            name: 'Humans',
                            value: interaction.guild.members.cache.filter(member => !member.user.bot).size.toString()
                        },
                        {
                            name: 'Bots',
                            value: interaction.guild.members.cache.filter(member => member.user.bot).size.toString()
                        },
                        {
                            name: 'Server Creation Date',
                            value: `<t:${Math.floor(interaction.guild.createdTimestamp / 1000)}:F>`
                        },
                        {
                            name: 'Server Owner',
                            value: interaction.guild.members.cache.get(interaction.guild.ownerId).toString()
                        })
                break;
        }
        await interaction.reply({ embeds: [embed] });
    }
}