const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'private',
  description: 'Ferme le salon vocal',
  aliases: [],
  type: 'misc', 
  usage: '.private',
  async execute(client, message, args) {
    // Vérifier si l'utilisateur est dans un salon vocal
    const memberVoiceChannel = message.member.voice.channel;
    if (!memberVoiceChannel) {
      return message.reply("Tu dois être dans un salon vocal pour utiliser cette commande.");
    }

    // Vérifier que l'utilisateur est le créateur du salon (en se basant sur le nom du salon)
    if (!memberVoiceChannel.name.includes(message.member.user.username)) {
      return message.reply("Tu ne peux pas rendre ce salon privé car tu n'es pas celui qui l'a créé.");
    }

    try {
      // Mettre le salon vocal en privé (empêcher les autres de se connecter)
      await memberVoiceChannel.permissionOverwrites.edit(message.guild.id, {
        [PermissionFlagsBits.Connect]: false,  // Empêcher tout le monde de rejoindre le salon
      });

      message.reply(`Le salon vocal ${memberVoiceChannel.name} est maintenant privé.`);
    } catch (error) {
      console.error("Erreur lors de la mise en privé du salon vocal :", error);
      message.reply("Une erreur est survenue en essayant de rendre le salon vocal privé.");
    }
  },
};





