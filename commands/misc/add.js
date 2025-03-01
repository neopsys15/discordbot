const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'add',
  description: 'Ajouter un utilisateur au vocal',
  aliases: [],
  type: 'misc',  
  usage: '.add {user}',
  async execute(client, message, args) {
    const user = message.mentions.members.first(); // Utilisateur mentionné
    const memberVoiceChannel = message.member.voice.channel; // Salon vocal de l'utilisateur qui envoie la commande

    if (!memberVoiceChannel) {
      return message.reply("Tu dois être dans un salon vocal pour utiliser cette commande.");
    }

    if (!user) {
      return message.reply("Tu dois mentionner un utilisateur.");
    }

    // Vérifier si le salon vocal de l'utilisateur est celui qui a été créé par la personne qui envoie la commande
    if (!memberVoiceChannel.name.includes(message.member.user.username)) {
      return message.reply("Tu ne peux pas ajouter un utilisateur dans ce salon car tu n'es pas celui qui l'a créé.");
    }

    try {
      // Ajouter les permissions pour l'utilisateur dans le salon vocal
      await memberVoiceChannel.permissionOverwrites.edit(user.id, {
        [PermissionFlagsBits.ViewChannel]: true, // Permet de voir le salon
        [PermissionFlagsBits.Connect]: true,     // Permet de rejoindre le salon vocal
      });

      message.reply(`${user.user.tag} a été ajouté au salon vocal ${memberVoiceChannel.name}.`);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur au salon vocal :", error);
      message.reply("Une erreur est survenue en essayant d'ajouter l'utilisateur au salon vocal.");
    }
  },
};





