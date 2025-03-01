const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'unban',
  description: 'Unban un utilisateur',
  aliases: [],
  type: 'moderation', 
  usage: '.unban {user}',
  async execute(client, message, args) {
    // ID du rôle qui correspond à Perm III
    const permIIIroleID = '123456789012345678'; // Remplacez par l'ID du rôle Perm III

    // Vérifie si l'utilisateur a le rôle Perm III
    if (!message.member.roles.cache.has(permIIIroleID)) {
      return message.channel.send({ content: "❌ Tu n'as pas la permission d'utiliser cette commande." });
    }

    // Vérifie si un ID d'utilisateur a été fourni
    const userId = args[0];
    if (!userId) {
      return message.channel.send({ content: "❌ Merci de fournir un ID utilisateur pour le débannir." });
    }

    try {
      // Tente de débannir l'utilisateur par ID
      await message.guild.bans.remove(userId);
      message.channel.send({ content: `✅ L'utilisateur avec l'ID ${userId} a été débanni.` });
    } catch (err) {
      console.error(err);
      message.channel.send({ content: "❌ Impossible de débannir cet utilisateur. Vérifie l'ID et que le bot a les bonnes permissions." });
    }
  }
};





