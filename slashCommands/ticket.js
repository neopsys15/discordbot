const { SlashCommandBuilder } = require('discord.js');
const ticketHandler = require('../handlers/tickethandler');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Gère les tickets')
    .addSubcommand(subcommand =>
      subcommand
        .setName('setup')
        .setDescription('Configure le système de tickets')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('close')
        .setDescription('Ferme le ticket actuel')
    ),
  async execute(interaction) {
    await interaction.deferReply();
    
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'setup') {
      await ticketHandler.setupTickets(interaction.channel);
      await interaction.editReply('Système de ticket configuré !');
    }
    
    if (subcommand === 'close') {
      try {
        await ticketHandler.closeTicket(interaction.channel);
        await interaction.editReply('Ticket fermé !');
      } catch (error) {
        await interaction.editReply(error.message);
      }
    }
  },
};