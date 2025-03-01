const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'ban',
  description: 'Ban un utilisateur',
  aliases: [],
  type: 'moderation',
  usage: '.ban {user} [raison]',
  async execute(client, message, args) {
    // Vérifie si l'utilisateur a la permission de bannir des membres
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.channel.send({ content: "❌ Tu n'as pas la permission de bannir des membres." });
    }

    // Vérifie si un utilisateur a été mentionné
    const user = message.mentions.members.first();
    if (!user) {
      return message.channel.send({ content: "❌ Merci de mentionner un utilisateur à bannir." });
    }

    // Récupère la raison, ou donne une raison par défaut
    const reason = args.slice(1).join(" ") || "Aucune raison spécifiée";

    // Bannir l'utilisateur
    try {
      await user.ban({ reason });

      // Envoi d'un message temporaire dans le canal d'origine
      const tempMessage = await message.channel.send({
        content: `✅ **${user.user.tag}** a été banni.`
      });

      setTimeout(() => tempMessage.delete(), 5000); // Suppression du message après 5 secondes

      // Création de l'embed de journalisation
      const banEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Sanction - Bannissement')
        .setDescription(`**Utilisateur banni :** ${user.user.tag}\n**Raison :** ${reason}\n**Type de sanction :** Bannissement`)
        .setTimestamp()
        .setFooter({ text: `Sanction effectuée par ${message.author.tag}` });

      // Envoi de l'embed dans le canal de sanctions
      const logChannel = message.guild.channels.cache.get('1343295945412055281'); // ID du canal de log
      if (logChannel) {
        await logChannel.send({ embeds: [banEmbed] });
      } else {
        console.log("Le canal des sanctions n'a pas été trouvé.");
      }
    } catch (err) {
      message.channel.send({ content: "❌ Impossible de bannir cet utilisateur." });
      console.error(err);
    }
  }
};





