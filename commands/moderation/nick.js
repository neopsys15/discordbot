const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'nick',
  aliases: [],
  type: 'moderation',
  description: 'Change le surnom d\'un utilisateur sur le serveur.',
  usage: '.nick {user} [nouveau nom]',
  async execute(client, message, args) {
    // Vérifie si l'utilisateur a la permission de gérer les surnoms
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
      return message.reply("❌ Tu n'as pas la permission de changer les surnoms sur ce serveur.");
    }

    // Vérifie si un utilisateur a été mentionné
    const user = message.mentions.members?.first();
    if (!user) {
      return message.reply("❌ Tu dois mentionner un utilisateur pour changer son surnom.");
    }

    // Si l'argument est 'none', réinitialiser le surnom
    if (args[1] && args[1].toLowerCase() === 'none') {
      try {
        await user.setNickname(null); // Réinitialiser le surnom
        return message.reply(`✅ Le surnom de ${user.user.tag} a été réinitialisé.`);
      } catch (error) {
        console.error(error);
        return message.reply("❌ Une erreur est survenue lors de la réinitialisation du surnom.");
      }
    }

    // Si un surnom est fourni, essayer de le changer
    const newNickname = args.slice(1).join(" ");
    if (!newNickname) {
      return message.reply("❌ Tu dois fournir un surnom.");
    }

    try {
      await user.setNickname(newNickname); // Modifier le surnom
      return message.reply(`✅ Le surnom de ${user.user.tag} a été changé en "${newNickname}".`);
    } catch (error) {
      console.error(error);
      return message.reply("❌ Une erreur est survenue lors du changement du surnom.");
    }
  }
};





