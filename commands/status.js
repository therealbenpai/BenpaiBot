const { SlashCommandBuilder } = require('discord.js');
const os = require('os');

module.exports = {
    name: 'status',
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Get the status of the bot.'),
    details: {
        description: 'Get the status of the bot.',
        usage: '`/status`'
    },
    async execute(client, interaction) {
        const uptime = client.timeManager.uptime();
        const ping = client.ws.ping;
        const avgCPU = []
        os.cpus().forEach(cpu => {
            avgCPU.push(((cpu.times.user + cpu.times.sys) / cpu.times.idle) * 100)
        })
        const cpu = avgCPU.reduce((a, b) => a + b, 0) / avgCPU.length;
        const memory = (os.totalmem() - os.freemem()) / 1024 / 1024 / 1024;
        const embed = client.configs.embed()
            .setTitle('Status')
            .addFields(
                { name: 'Uptime', value: `Current Uptime: ${uptime}`, inline: true },
                { name: 'Ping', value: `Current Ping: ${ping}ms`, inline: true },
                { name: 'CPU', value: `Current CPU Usage: ${cpu.toFixed(2)}%`, inline: true },
                { name: 'Memory', value: `Current Memory Usage: ${memory.toFixed(2)}GB`, inline: true }
            )
        await interaction.reply({ embeds: [embed] });
    }
}