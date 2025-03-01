const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'open',
  description: 'Ouvre le salon vocal',
  aliases: [], 
  type: 'misc', 
  usage: '.open',
  async execute(client, message, args) {
    const memberVoiceChannel = message.member.voice.channel; // Salon vocal de l'utilisateur qui exécute la commande

    if (!memberVoiceChannel) {
      return message.reply("Tu dois être dans un salon vocal pour utiliser cette commande.");
    }

    // Vérifier si l'utilisateur est le créateur du salon vocal
    if (!memberVoiceChannel.name.includes(message.member.user.username)) {
      return message.reply("Tu ne peux pas ouvrir ce salon car tu n'es pas celui qui l'a créé.");
    }

    try {
      // Rétablir les permissions pour permettre à tout le monde d'accéder
      await memberVoiceChannel.permissionOverwrites.edit(message.guild.id, {
        [PermissionFlagsBits.Connect]: true,  // Permettre à tout le monde de rejoindre le salon vocal
      });

      message.reply(`Le salon vocal ${memberVoiceChannel.name} est maintenant ouvert pour tout le monde.`);
    } catch (error) {
      console.error("Erreur lors de l'ouverture du salon vocal :", error);
      message.reply("Une erreur est survenue en essayant d'ouvrir le salon vocal.");
    }
  },
};





