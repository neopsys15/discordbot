const { PermissionsBitField } = require('discord.js');
const axios = require('axios'); // Pour télécharger l'image de l'emoji

module.exports = {
  name: 'addemoji',
  aliases: [],
  type: 'moderation',
  description: 'Ajoute un emoji d\'un autre serveur à votre serveur.',
  usage: '.addemoji {emoji} [nom]',
  async execute(client, message, args) {
    // Vérifie si l'utilisateur a la permission d'ajouter des emojis
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageEmojisAndStickers)) {
      return message.reply("❌ Tu n'as pas la permission d'ajouter des emojis sur ce serveur.");
    }

    // Vérifie si un emoji a été fourni dans le message
    const emoji = args[0];
    const emojiName = args[1] || 'emoji_' + Date.now();  // Nom personnalisé ou nom par défaut

    if (!emoji) {
      return message.reply("❌ Tu dois fournir un emoji valide. Exemple : `.stealemote :pepe: nom_emoji`.");
    }

    // Récupérer l'ID de l'emoji à partir de son format Discord
    let emojiID;
    let isAnimated = false;
    if (emoji.includes(":")) {
      // L'emoji est dans un format standard :emoji: ou :a:emoji: pour les animés
      const match = emoji.match(/(?:<a?:\w+:)(\d+)>/);
      if (match) {
        emojiID = match[1];
        isAnimated = emoji.startsWith('<a:'); // Si l'emoji commence par <a:, c'est un emoji animé
      }
    }

    if (!emojiID) {
      return message.reply("❌ Impossible de récupérer l'ID de l'emoji. Assure-toi qu'il s'agit d'un emoji valide.");
    }

    // Construire l'URL de l'emoji à partir de son ID
    const emojiUrl = isAnimated 
      ? `https://cdn.discordapp.com/emojis/${emojiID}.gif`  // URL pour un emoji animé
      : `https://cdn.discordapp.com/emojis/${emojiID}.png`; // URL pour un emoji classique

    try {
      // Télécharge l'image de l'emoji
      const response = await axios.get(emojiUrl, { responsetype: 'moderation' });

      // Vérifie si l'image a bien été récupérée
      if (response.status !== 200) {
        return message.reply("❌ Impossible de récupérer l'emoji. Assure-toi que l'emoji est valide.");
      }

      // Crée un fichier buffer à partir de l'image téléchargée
      const buffer = Buffer.from(response.data, 'binary');

      // Crée l'emoji sur le serveur
      const newEmoji = await message.guild.emojis.create({
        attachment: buffer,
        name: emojiName,
      });

      // Réponse de succès
      message.reply(`✅ Emoji ajouté avec succès : ${newEmoji}`);
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout de l'emoji : ", error);
      message.reply("❌ Une erreur est survenue lors de l'ajout de l'emoji. Assure-toi que l'emoji existe et que le bot a accès à l'URL.");
    }
  },
};





