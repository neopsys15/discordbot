const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'serverinfo',
  description: 'Commande serverinfo',
  aliases: [],  
  type: 'utilities',  
  usage: '.serverinfo',
  execute(client, message, args) {
    const { name, memberCount, owner, createdAt, region, iconURL } = message.guild;

    // Création de l'embed
    const serverEmbed = new EmbedBuilder()
      .setColor('#3498db')
      .setTitle(`Informations sur le serveur : ${name}`)
      .addFields(
        { name: 'serverinfo',
  description: 'Commande serverinfo',
  aliases: [], value: owner.user.tag, inline: true },
        { name: 'serverinfo',
  description: 'Commande serverinfo',
  aliases: [], value: memberCount.toString(), inline: true },
        { name: 'serverinfo',
  description: 'Commande serverinfo',
  aliases: [], value: region, inline: true },
        { name: 'serverinfo',
  description: 'Commande serverinfo',
  aliases: [], value: `<t:${Math.floor(createdAt / 1000)}:f>`, inline: true }
      )
      .setTimestamp();

    // Vérifier s'il y a une icône et l'ajouter si elle existe
    if (iconURL()) {
      serverEmbed.setThumbnail(iconURL());
    }

    // Répondre avec l'embed
    message.reply({ embeds: [serverEmbed] });
  }
};





