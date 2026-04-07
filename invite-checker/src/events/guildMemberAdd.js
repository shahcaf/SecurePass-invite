const { fetchInvites, getCache, getVanityCache } = require('../utils/inviteCache');
const db = require('../database');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        if (member.user.bot) return;

        const oldInvites = getCache(member.guild.id);
        const oldVanity = getVanityCache(member.guild.id);

        const newInvites = await fetchInvites(member.guild);
        const newVanity = member.guild.features.includes('VANITY_URL') ? await member.guild.fetchVanityData().catch(() => null) : null;

        if (!oldInvites || !newInvites) return;

        let usedInvite = null;
        let isVanity = false;

        // 1. Check for standard invite use
        usedInvite = newInvites.find(inv => {
            const cached = oldInvites.get(inv.code);
            return cached && inv.uses > cached.uses;
        });

        // 2. Check for vanity URL use (if not found in regular invites)
        if (!usedInvite && oldVanity && newVanity) {
            if (newVanity.uses > oldVanity.uses) {
                isVanity = true;
            }
        }

        // 3. Check for deleted invites (reached max uses)
        if (!usedInvite && !isVanity) {
            usedInvite = oldInvites.find(inv => !newInvites.has(inv.code));
        }

        const welcomeChannel = member.guild.systemChannel || member.guild.channels.cache.find(ch => ch.name.includes('welcome') || ch.name.includes('logs'));

        if (isVanity) {
            if (welcomeChannel) {
                const embed = new EmbedBuilder()
                    .setColor('#AA33FF')
                    .setDescription(`<@${member.id}> joined using the server's **Vanity URL**`)
                    .setTimestamp();
                welcomeChannel.send({ embeds: [embed] });
            }
        } else if (usedInvite && usedInvite.inviter) {
            const inviter = await member.guild.members.fetch(usedInvite.inviter).catch(() => null);
            
            try {
                // Update database
                await db.query(`
                    INSERT INTO user_stats (user_id, invites, joins) 
                    VALUES ($1, 1, 1) 
                    ON CONFLICT (user_id) DO UPDATE SET invites = user_stats.invites + 1, joins = user_stats.joins + 1
                `, [usedInvite.inviter]);

                await db.query(`
                    INSERT INTO invitations (invited_id, inviter_id) 
                    VALUES ($1, $2) 
                    ON CONFLICT (invited_id) DO UPDATE SET inviter_id = $2
                `, [member.id, usedInvite.inviter]);

                if (welcomeChannel) {
                    const embed = new EmbedBuilder()
                        .setColor('#00ff00')
                        .setDescription(`<@${member.id}> joined using <@${usedInvite.inviter}>'s invite (\`${usedInvite.code}\`)`)
                        .setTimestamp();
                    welcomeChannel.send({ embeds: [embed] });
                }
            } catch (err) {
                console.error('Error updating join stats:', err);
            }
        } else {
            if (welcomeChannel) {
                welcomeChannel.send(`<@${member.id}> joined but I couldn't find who invited them.`);
            }
        }
    },
};
