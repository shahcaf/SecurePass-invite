const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invites')
        .setDescription('Check yours or someone else\'s invites.')
        .addUserOption(option => option.setName('user').setDescription('The user to check')),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('user') || interaction.user;
        
        try {
            const statsResult = await db.query('SELECT invites, joins, leaves FROM user_stats WHERE user_id = $1', [targetUser.id]);
            const stats = statsResult.rows[0] || { invites: 0, joins: 0, leaves: 0 };

            const embed = new EmbedBuilder()
                .setTitle(`${targetUser.tag}'s Invites`)
                .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
                .setColor('#5865F2')
                .addFields(
                    { name: 'Total Invites', value: `\`${stats.joins}\``, inline: true },
                    { name: 'Valid Invites', value: `\`${stats.invites}\``, inline: true },
                    { name: 'Left Invites', value: `\`${stats.leaves}\``, inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.error('Error fetching invites:', err);
            await interaction.reply({ content: 'There was an error while fetching the invites.', ephemeral: true });
        }
    },
};
