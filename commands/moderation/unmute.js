const { PermissionsBitField } = require('discord.js');  // Importation nécessaire

module.exports = {
  name: 'unmute',
  description: 'Commande unmute',
  aliases: [],  
  type: 'moderation',  
  usage: '.unmute',
  async execute(client, message, args) {
    // Vérifie si l'utilisateur a la permission de gérer les membres (Perm II et plus)
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return message.channel.send({ content: "❌ Tu n'as pas la permission de unmute des membres." });
    }

    const user = message.mentions.members.first();
    if (!user) return message.channel.send({ content: "❌ Merci de mentionner un utilisateur à unmute." });

    // Vérifier si l'utilisateur est unmute temporairement (temp mute)
    // On suppose que le mute temporaire est enregistré quelque part (par exemple dans une base de données ou un système d'index des mutes)
    const muteData = client.tempMutes && client.tempMutes.get(user.id);  // Supposons que client.tempMutes est un Map des utilisateurs en mute temporaire
    if (muteData) {
      // Si l'utilisateur a un mute temporaire, on supprime la durée et le mute
      client.tempMutes.delete(user.id);  // Enlève l'utilisateur de la liste des mutes temporaires (si tu utilises un Map)
      console.log(`Temp mute supprimé pour ${user.user.tag}`);
    }

    // Vérifie l'existence du rôle Muted
    let muteRole = message.guild.roles.cache.find(role => role.name === "Muted");
    if (!muteRole) return message.channel.send({ content: "❌ Le rôle `Muted` n'existe pas sur ce serveur." });

    // Retirer le rôle "Muted" à l'utilisateur
    try {
      await user.roles.remove(muteRole);
      message.channel.send({ content: `🔊 **${user.user.tag}** a été unmute.` });
    } catch (err) {
      console.error(err);
      message.channel.send({ content: "❌ Impossible de unmute cet utilisateur." });
    }
  }
};





