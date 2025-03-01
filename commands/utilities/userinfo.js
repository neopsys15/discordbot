const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'userinfo',
  description: 'Commande userinfo',
  aliases: [],  
  type: 'utilities',  
  usage: '.userinfo',
  execute(client, message, args) {
    // Si un utilisateur est mentionné, on prend cette mention, sinon on prend l'utilisateur qui a exécuté la commande
    const user = message.mentions.members.first() || message.member;

    // Crée un embed pour afficher les informations de l'utilisateur
    const userInfoEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`Informations de ${user.user.tag}`)
      .setThumbnail(user.user.displayAvatarURL())
      .addFields(
        { name: 'Nom d\'utilisateur', value: user.user.username, inline: true },
        { name: 'userinfo',
  description: 'Commande userinfo',
  aliases: [], value: user.user.tag, inline: true },
        { name: 'userinfo',
  description: 'Commande userinfo',
  aliases: [], value: user.id, inline: true },
        { name: 'userinfo',
  description: 'Commande userinfo',
  aliases: [], value: user.presence ? user.presence.status : 'Non défini', inline: true },
        { name: 'userinfo',
  description: 'Commande userinfo',
  aliases: [], value: user.roles.cache.map(role => role.name).join(', ') || 'Aucun', inline: false },
        { name: 'Date d\'adhésion', value: user.joinedAt.toLocaleDateString(), inline: true },
        { name: 'Date d\'inscription', value: user.user.createdAt.toLocaleDateString(), inline: true },
      )
      .setTimestamp()
      .setFooter({ text: `Demandé par ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

    // Envoie l'embed dans le canal
    message.channel.send({ embeds: [userInfoEmbed] });
  },
};





