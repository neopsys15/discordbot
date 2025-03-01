const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Affiche la liste des commandes par catégorie ou une aide spécifique',
  aliases: [],
  type: 'utilities',
  usage: '.help',
  async execute(client, message, args) {
    // Récupère toutes les commandes triées par catégorie
    const categories = {};
    client.commands.forEach(command => {
      const category = command.type || 'misc';
      if (!categories[category]) categories[category] = [];
      categories[category].push(command);
    });

    // Liste des catégories avec 'moderation' en dernier
    const categoryList = Object.keys(categories)
      .filter(cat => cat !== 'moderation')
      .sort()
      .concat('moderation');
    const pages = [];
    const commandsPerPage = 10;

    // Page d'accueil
    const welcomeEmbed = new EmbedBuilder()
      .setTitle('Aide - Catégories')
      .setDescription('Voici les catégories disponibles. Clique sur "Suivant" pour voir les commandes.')
      .setColor('#0099ff');
    let pageCounter = 1;
    categoryList.forEach(category => {
      const commands = categories[category] || [];
      const pageCount = Math.max(1, Math.ceil(commands.length / commandsPerPage)); // Au moins 1 page
      welcomeEmbed.addFields({
        name: `${category.charAt(0).toUpperCase() + category.slice(1)}`,
        value: `${commands.length} commande(s) - Pages ${pageCounter} à ${pageCounter + pageCount - 1}`,
        inline: true,
      });
      pageCounter += pageCount;
    });
    pages.push(welcomeEmbed);

    // Crée une page pour chaque catégorie
    categoryList.forEach(category => {
      const commands = categories[category];
      if (!commands || commands.length === 0) return; // Ignore si pas de commandes
      const commandDescriptions = commands.map(cmd => `**${cmd.name}** - ${cmd.description || 'Pas de description'}`);
      for (let i = 0; i < commandDescriptions.length; i += commandsPerPage) {
        const pageCommands = commandDescriptions.slice(i, i + commandsPerPage);
        const embed = new EmbedBuilder()
          .setTitle(`Commandes - ${category.charAt(0).toUpperCase() + category.slice(1)}`)
          .setDescription(pageCommands.join('\n') || 'Aucune commande dans cette catégorie.')
          .setColor('#0099ff');
        pages.push(embed);
      }
    });

    if (pages.length === 0) {
      return message.channel.send({ content: 'Aucune commande disponible pour le moment.' });
    }

    // Gestion des arguments
    if (args.length > 0) {
      const input = args[0].toLowerCase();

      // Vérifie si c'est une catégorie
      if (categoryList.includes(input)) {
        const categoryPages = pages.filter(page => 
          page.data.title && page.data.title.toLowerCase().includes(input)
        );
        return message.channel.send({ embeds: [categoryPages[0] || pages[0]] });
      }

      // Vérifie si c'est une commande spécifique
      const command = client.commands.get(input) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(input));
      if (command) {
        const embed = new EmbedBuilder()
          .setTitle(`Aide - ${command.name}`)
          .setDescription(command.description || 'Pas de description disponible.')
          .setColor('#0099ff')
          .addFields(
            { name: 'Usage', value: command.usage || 'Non spécifié', inline: true },
            { name: 'Catégorie', value: command.type || 'misc', inline: true }
          );
        if (command.aliases && command.aliases.length > 0) {
          embed.addFields({ name: 'Alias', value: command.aliases.join(', ') || 'Aucun', inline: true });
        }
        return message.channel.send({ embeds: [embed] });
      }

      return message.channel.send({ content: `❌ Catégorie ou commande "${input}" non trouvée.` });
    }

    // Crée les boutons
    const buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('previous')
          .setLabel('Précédent')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId('next')
          .setLabel('Suivant')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(pages.length <= 1)
      );

    // Envoie le message avec la page d'accueil
    const helpMessage = await message.channel.send({
      embeds: [pages[0]],
      components: [buttons],
    });

    if (pages.length <= 1) return;

    // Crée un collecteur pour les boutons
    const filter = interaction => ['previous', 'next'].includes(interaction.customId) && interaction.user.id === message.author.id;
    const collector = helpMessage.createMessageComponentCollector({ filter, time: 60000 });

    let currentPage = 0;

    collector.on('collect', async interaction => {
      if (interaction.customId === 'next' && currentPage < pages.length - 1) {
        currentPage++;
      } else if (interaction.customId === 'previous' && currentPage > 0) {
        currentPage--;
      }

      const updatedButtons = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('previous')
            .setLabel('Précédent')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage === 0),
          new ButtonBuilder()
            .setCustomId('next')
            .setLabel('Suivant')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage === pages.length - 1)
        );

      const currentEmbed = pages[currentPage];
      currentEmbed.setFooter({ text: `Page ${currentPage + 1} sur ${pages.length}` });

      await interaction.update({
        embeds: [currentEmbed],
        components: [updatedButtons],
      });
    });

    collector.on('end', () => {
      const disabledButtons = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('previous')
            .setLabel('Précédent')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId('next')
            .setLabel('Suivant')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true)
        );

      helpMessage.edit({ components: [disabledButtons] }).catch(() => {});
    });
  },
};