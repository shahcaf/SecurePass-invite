const db = require('../database');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
        if (member.user.bot) return;

        try {
            // Get the user who invited them
            const inviteResult = await db.query('SELECT inviter_id FROM invitations WHERE invited_id = $1', [member.id]);
            const inviterId = inviteResult.rows.length > 0 ? inviteResult.rows[0].inviter_id : null;

            if (inviterId) {
                // Update inviter statistics
                await db.query(`
                    UPDATE user_stats 
                    SET invites = GREATEST(0, invites - 1), leaves = leaves + 1 
                    WHERE user_id = $1
                `, [inviterId]);

                const logChannel = member.guild.systemChannel || member.guild.channels.cache.find(ch => ch.name.includes('welcome') || ch.name.includes('logs'));

                if (logChannel) {
                    const embed = new EmbedBuilder()
                        .setColor('#ff0000')
                        .setDescription(`<@${member.id}> left (invited by <@${inviterId}>)`)
                        .setTimestamp();
                    logChannel.send({ embeds: [embed] });
                }
            } else {
                console.log(`User ${member.user.tag} left, but no inviter was found in the database.`);
            }
        } catch (err) {
            console.error('Error updating leave stats:', err);
        }
    },
};
