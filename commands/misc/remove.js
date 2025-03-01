const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'remove',
  description: 'Enleve l\'accès a un utilisateur',
  aliases: [],
  type: 'misc',
  usage: '.remove {user}',
  async execute(client, message, args) {
    const user = message.mentions.members.first(); // Utilisateur mentionné
    const memberVoiceChannel = message.member.voice.channel; // Salon vocal de l'utilisateur qui envoie la commande

    if (!memberVoiceChannel) {
      return message.reply("Tu dois être dans un salon vocal pour utiliser cette commande.");
    }

    if (!user) {
      return message.reply("Tu dois mentionner un utilisateur.");
    }

    // Vérifier si l'utilisateur mentionné est déjà dans un salon vocal
    const userVoiceChannel = user.voice.channel;
    if (!userVoiceChannel) {
      return message.reply("L'utilisateur mentionné n'est pas dans un salon vocal.");
    }

    // Vérifier si le salon vocal où l'utilisateur veut retirer quelqu'un est le même
    if (memberVoiceChannel.id !== userVoiceChannel.id) {
      return message.reply("Tu ne peux pas retirer cet utilisateur d'un salon vocal qui n'est pas le tien.");
    }

    try {
      // Retirer les permissions pour l'utilisateur dans le salon vocal
      await memberVoiceChannel.permissionOverwrites.edit(user.id, {
        [PermissionFlagsBits.ViewChannel]: false, // Empêcher de voir le salon
        [PermissionFlagsBits.Connect]: false,     // Empêcher de se connecter au salon vocal
      });

      message.reply(`${user.user.tag} a été retiré du salon vocal ${memberVoiceChannel.name}.`);
    } catch (error) {
      console.error("Erreur lors du retrait de l'utilisateur du salon vocal :", error);
      message.reply("Une erreur est survenue en essayant de retirer l'utilisateur du salon vocal.");
    }
  },
};





