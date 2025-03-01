const { PermissionsBitField } = require('discord.js'); // Assure-toi d'importer PermissionsBitField

module.exports = {
  name: 'clear',
  description: 'Supprime entre 1 et 100 messages',
  aliases: [],  
  type: 'moderation', 
  usage: '.clear {nombre}',
  async execute(client, message, args) {
    // Si la commande est .help clear
    if (args[0] && args[0].toLowerCase() === "help") {
      return message.reply({
        content: `**Usage de la commande :** \n
          \`!clear [nombre]\`\n
          - **[nombre]** : Le nombre de messages que tu souhaites supprimer (entre 1 et 100).\n
        \n\n
        **Exemple de commande :** \n
        \`!clear 10\``
      });
    }

    // Vérifie si l'utilisateur a la permission de gérer les messages
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.channel.send({ content: "❌ Tu n'as pas la permission de gérer les messages." });
    }

    // Vérifie si un nombre de messages est donné
    const amount = parseInt(args[0]);
    if (isNaN(amount) || amount <= 0 || amount > 100) {
      return message.channel.send({ content: "❌ Tu dois spécifier un nombre entre 1 et 100." });
    }

    // Supprimer les messages
    try {
      await message.delete(); // Supprime la commande elle-même
      const messages = await message.channel.bulkDelete(amount, true); // Supprime les messages
      message.channel.send({ content: `🔨 **${messages.size}** message(s) ont été supprimés.` })
        .then(msg => setTimeout(() => msg.delete(), 5000)); // Supprime le message de confirmation après 5 secondes
    } catch (err) {
      console.error(err);
      message.channel.send({ content: "❌ Une erreur est survenue lors de la suppression des messages." });
    }
  }
};





