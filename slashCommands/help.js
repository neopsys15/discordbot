const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Affiche une aide pour les commandes du bot'),

  async execute(interaction) {
    // Récupérer toutes les commandes enregistrées
    const client = interaction.client;
    const commands = client.commands;

    // Créer la liste des commandes
    const commandsList = commands.map((command) => {
      return `/${command.data.name} - ${command.data.description || 'Pas de description'}`;
    });

    // Construction du message d'aide
    const helpMessage = `Voici les commandes disponibles pour ce bot :\n\n${commandsList.join('\n')}`;

    await interaction.reply({
      content: helpMessage,
      ephemeral: true, // Rendre le message visible uniquement à l'utilisateur qui a appelé la commande
    });
  },
};
