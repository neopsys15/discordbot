const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'kick',
  description: 'Kick un utilisateur',
  aliases: [],
  type: 'moderation',
  usage: '.kick {user} [raison]',
  async execute(client, message, args) {
    // Vérifie si l'utilisateur a la permission d'expulser des membres
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.channel.send({ content: "❌ Tu n'as pas la permission d'expulser des membres." });
    }

    // Vérifier si un utilisateur a été mentionné
    const member = message.mentions.members.first();
    if (!member) {
      return message.channel.send({ content: "❌ Merci de mentionner un utilisateur à expulser." });
    }

    // Vérifier si le membre peut être expulsé
    if (!member.kickable) {
      return message.channel.send({ content: "❌ Je ne peux pas expulser cet utilisateur." });
    }

    // Récupérer la raison
    const reason = args.slice(1).join(' ') || 'Aucune raison spécifiée';

    try {
      // Envoyer un message privé à l'utilisateur expulsé
      const dmEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('🚨 Expulsion du serveur')
        .setDescription(`Vous avez été expulsé de **${message.guild.name}**.`)
        .addFields({ 
  type: 'moderation', value: reason })
        .setFooter({ text: `Expulsé par ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
        .setTimestamp();

      await member.send({ embeds: [dmEmbed] }).catch(() => {
        console.log(`Impossible d'envoyer un message privé à ${member.user.tag}.`);
      });

      // Expulser l'utilisateur
      await member.kick(reason);

      // Envoi d'un message temporaire dans le canal d'origine
      const tempEmbed = new EmbedBuilder()
        .setColor('#00FF00')
        .setDescription(`✅ **${member.user.tag}** a été expulsé.`);

      const tempMessage = await message.channel.send({ embeds: [tempEmbed] });
      setTimeout(() => tempMessage.delete(), 5000);

      // Création de l'embed de journalisation
      const kickEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('🛑 Sanction - Expulsion')
        .setDescription(`**Utilisateur expulsé :** ${member.user.tag}`)
        .addFields({ type: 'moderation', value: reason })
        .setFooter({ text: `Sanction effectuée par ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
        .setTimestamp();

      // Envoi de l'embed dans le canal de logs
      const logChannel = message.guild.channels.cache.get('1343295945412055281'); // ID du canal de log
      if (logChannel) {
        await logChannel.send({ embeds: [kickEmbed] });
      } else {
        console.log("Le canal des sanctions n'a pas été trouvé.");
      }
    } catch (err) {
      message.channel.send({ content: "❌ Impossible d'expulser cet utilisateur." });
      console.error(err);
    }
  }
};





