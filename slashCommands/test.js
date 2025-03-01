const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('jklm')
    .setDescription('Une commande slash avec un nom bizarre'),
  async execute(interaction) {
    await interaction.reply('La commande /jklm a été exécutée avec succès !');
  },
};
