const { Collection } = require('discord.js');

const invitesCache = new Collection();
const vanityCache = new Collection();

const fetchInvites = async (guild) => {
    try {
        // Fetch regular invites
        const guildInvites = await guild.invites.fetch();
        const cache = new Collection();
        guildInvites.forEach(invite => {
            cache.set(invite.code, {
                code: invite.code,
                uses: invite.uses,
                inviter: invite.inviter ? invite.inviter.id : null
            });
        });
        invitesCache.set(guild.id, cache);

        // Fetch vanity URL if available
        if (guild.features.includes('VANITY_URL')) {
            const vanityData = await guild.fetchVanityData().catch(() => null);
            if (vanityData) {
                vanityCache.set(guild.id, {
                    code: vanityData.code,
                    uses: vanityData.uses
                });
            }
        }
        
        return cache;
    } catch (err) {
        console.error(`Error fetching invites for guild ${guild.id}:`, err);
        return null;
    }
};

const getCache = (guildId) => invitesCache.get(guildId);
const getVanityCache = (guildId) => vanityCache.get(guildId);

module.exports = {
    fetchInvites,
    getCache,
    getVanityCache,
    invitesCache
};
