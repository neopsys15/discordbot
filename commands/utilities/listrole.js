const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'listroles',
  aliases: ['roles', 'rolelist'],
  description: 'Affiche la liste des rôles du serveur dans l’ordre hiérarchique.',
  usage: '.listroles',
  async execute(client, message, args) {
    const isMessage = message.reply && !message.commandName;
    const channel = isMessage ? message.channel : message.channel;

    try {
      // Vérifier que le guild est disponible
      if (!message.guild) {
        return channel.send('Cette commande ne peut être utilisée qu dans un serveur.');
      }

      // Récupérer les rôles du serveur, triés par position
      const roles = message.guild.roles.cache
        .sort((a, b) => b.position - a.position) // Tri par position, du plus haut au plus bas
        .map(role => `${role.name} (ID: ${role.id})`); // Format : Nom (ID)

      // Vérifier s’il y a des rôles
      if (roles.length === 0) {
        return channel.send('Aucun rôle trouvé dans ce serveur.');
      }

      // Préparer la description
      let description = roles.join('\n');
      const maxLength = 2000; // Limite approximative pour un embed

      // Si la description est trop longue, la tronquer
      if (description.length > maxLength) {
        const truncatedRoles = roles.slice(0, Math.floor(maxLength / averageRoleLength(roles)));
        description = `${truncatedRoles.join('\n')}\n\n*Et plus encore... (liste tronquée)*`;
      }

      // Créer l’embed avec la description préparée
      const embed = new EmbedBuilder()
        .setTitle(`Rôles du serveur : ${message.guild.name}`)
        .setDescription(description)
        .setColor('#0099FF')
        .setFooter({ text: `Total : ${roles.length} rôles` })
        .setTimestamp();

      await channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(`Erreur dans listroles : ${error.message}`);
      if (isMessage) {
        await message.reply('Erreur lors de la récupération des rôles.');
      } else {
        await message.reply({ content: 'Erreur lors de la récupération des rôles.', ephemeral: true });
      }
    }
  }
};

// Fonction pour estimer la longueur moyenne d’une ligne
function averageRoleLength(roles) {
  const totalLength = roles.reduce((sum, role) => sum + role.length, 0);
  return totalLength / roles.length || 1;
}