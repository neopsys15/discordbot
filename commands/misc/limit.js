module.exports = {
  name: 'limit',
  description: 'Ajoute une limite a la vocal',
  aliases: [],  
  type: 'misc',
  usage: '.limit {nombre}',
  async execute(client, message, args) {
      const limit = parseInt(args[0]); // Nombre de personnes autorisées
      const memberVoiceChannel = message.member.voice.channel; // Salon vocal de l'utilisateur qui exécute la commande
  
      if (!memberVoiceChannel) {
        return message.reply("Tu dois être dans un salon vocal pour utiliser cette commande.");
      }
  
      // Vérifier si l'utilisateur est le créateur du salon vocal (par exemple, vérifier le nom du salon)
      if (!memberVoiceChannel.name.includes(message.member.user.username)) {
        return message.reply("Tu ne peux pas limiter ce salon car tu n'es pas celui qui l'a créé.");
      }
  
      // Vérifier si la limite est un nombre valide et positif
      if (isNaN(limit) || limit <= 0) {
        return message.reply("Le nombre de personnes doit être un nombre positif.");
      }
  
      // Appliquer la limite d'utilisateurs au salon vocal
      await memberVoiceChannel.setUserLimit(limit);
      message.reply(`Le salon vocal ${memberVoiceChannel.name} a été limité à ${limit} utilisateurs.`);
    },
  };
  




