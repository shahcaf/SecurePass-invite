const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Shows the top inviters in the server'),
    async execute(interaction) {
        try {
            const leaderboardResult = await db.query('SELECT user_id, invites FROM user_stats WHERE invites > 0 ORDER BY invites DESC LIMIT 10');
            const leaderboard = leaderboardResult.rows;

            const embed = new EmbedBuilder()
                .setTitle('🏆 Top Inviters')
                .setColor('#FFD700')
                .setTimestamp();

            if (leaderboard.length === 0) {
                embed.setDescription('No invites tracked yet.');
            } else {
                let description = '';
                for (let i = 0; i < leaderboard.length; i++) {
                    const user = await interaction.client.users.fetch(leaderboard[i].user_id).catch(() => ({ tag: 'Unknown' }));
                    description += `${i + 1}. **${user.tag}** — \`${leaderboard[i].invites}\` invites\n`;
                }
                embed.setDescription(description);
            }

            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.error('Error fetching leaderboard:', err);
            await interaction.reply({ content: 'There was an error while fetching the leaderboard.', ephemeral: true });
        }
    },
};
