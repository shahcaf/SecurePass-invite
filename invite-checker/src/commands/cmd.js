const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cmd')
        .setDescription('List all commands in a dropdown menu'),
    async execute(interaction) {
        const commands = interaction.client.commands;
        
        const select = new StringSelectMenuBuilder()
            .setCustomId('command_help')
            .setPlaceholder('Select a command to learn more...')
            .addOptions(
                commands.map(cmd => 
                    new StringSelectMenuOptionBuilder()
                        .setLabel(`/${cmd.data.name}`)
                        .setDescription(cmd.data.description)
                        .setValue(cmd.data.name)
                )
            );

        const row = new ActionRowBuilder().addComponents(select);

        const embed = new EmbedBuilder()
            .setTitle('🤖 Bot Commands')
            .setDescription('Select a command from the dropdown menu below to see more details.')
            .setColor('#5865F2')
            .setTimestamp();

        const response = await interaction.reply({
            embeds: [embed],
            components: [row],
        });

        // Optional: Handling the selection (can be done in interactionCreate.js too, 
        // but for simplicity we can do a collector here)
        const collector = response.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'command_help') {
                const selectedCmd = commands.get(i.values[0]);
                
                const detailEmbed = new EmbedBuilder()
                    .setTitle(`Command: /${selectedCmd.data.name}`)
                    .setDescription(selectedCmd.data.description)
                    .setColor('#5865F2')
                    .setTimestamp();

                await i.update({ embeds: [detailEmbed], components: [row] });
            }
        });
    },
};
