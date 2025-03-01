const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'avatar',
  description: 'Commande avatar',
  aliases: [],  
  type: 'utilities',
  description: 'Afficher l\'avatar d\'un utilisateur.',  
  usage: '.avatar',
  execute(client, message, args) {
    // Vérifier si un utilisateur a été mentionné ou pas
    const member = message.mentions.members.first() || message.member;

    if (!member) {
      // Si l'utilisateur mentionné est invalide
      return message.reply({ content: '❌ Je n\'ai pas pu trouver cet utilisateur.' });
    }

    // Création de l'embed pour afficher l'avatar
    const avatarEmbed = new EmbedBuilder()
      .setColor('#FF6347')
      .setTitle(`Avatar de ${member.user.tag}`)
      .setImage(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .setTimestamp()
      .setFooter({ text: 'Demande effectuée par ' + message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

    // Répondre avec l'embed
    message.reply({ embeds: [avatarEmbed] });
  }
};





