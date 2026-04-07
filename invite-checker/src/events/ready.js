const { fetchInvites } = require('../utils/inviteCache');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Logged in as ${client.user.tag}!`);
        
        // Fetch and cache invites for all guilds
        for (const guild of client.guilds.cache.values()) {
            await fetchInvites(guild);
        }
        console.log('Successfully cached invites (including vanity URLs) for all guilds.');

        // Simple activity
        client.user.setActivity('Tracking Invites');
    },
};
