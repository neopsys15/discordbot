const { PermissionsBitField } = require('discord.js');  // Ajout de l'importation nécessaire
module.exports = {
  name: 'ping',
  description: 'Commande ping',
  aliases: [],  
  type: 'utilities',  
  usage: '.ping',
  execute(client, message, args) {
    const ping = Date.now() - message.createdTimestamp; // Calcule la latence
    message.channel.send({ content: `🏓 Pong! Latence : **${ping}ms**` });
  }
};






