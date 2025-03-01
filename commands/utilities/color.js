const { EmbedBuilder } = require('discord.js');

// Un objet de correspondance entre les couleurs et leurs valeurs hexadécimales
const colorMap = {
  red: '#FF0000',
  green: '#00FF00',
  blue: '#0000FF',
  yellow: '#FFFF00',
  orange: '#FFA500',
  purple: '#800080',
  pink: '#FFC0CB',
  black: '#000000',
  white: '#FFFFFF',
  gray: '#808080',
  brown: '#A52A2A',
  cyan: '#00FFFF',
  magenta: '#FF00FF',
  lime: '#00FF00',
  indigo: '#4B0082',
  violet: '#8A2BE2',
  gold: '#FFD700',
  silver: '#C0C0C0',
};

module.exports = {
  name: 'color',
  description: 'Commande color',
  aliases: [],  
  type: 'utilities',  
  usage: '.color',
  async execute(client, message, args) {
    // Vérifie si l'utilisateur a donné un argument
    if (!args.length) {
      return message.reply('Veuillez fournir une couleur ou un code hex ! Exemple : `.color red` ou `.color #FF0000`');
    }

    // Récupère l'argument
    const colorInput = args[0].toLowerCase();

    let colorHex;

    // Si l'argument commence par "#", on le traite comme un code hex
    if (colorInput.startsWith('#')) {
      // Vérifie si c'est un code hex valide
      const hexRegex = /^#[0-9A-F]{6}$/i;
      if (hexRegex.test(colorInput)) {
        colorHex = colorInput;
        
        // Créer l'embed pour afficher la couleur
        const embed = new EmbedBuilder()
          .setColor(colorHex)
          .setTitle(`Voici la couleur avec le code hex ${colorHex}`)
          .setDescription(`Code Hex : ${colorHex}`)
          .setFooter({ text: `Couleur demandée par ${message.author.tag}` })
          .setTimestamp();

        return message.channel.send({ embeds: [embed] });
      } else {
        return message.reply('Le code hex que vous avez fourni n\'est pas valide ! Exemple : `.color #FF0000`');
      }
    } else {
      // Sinon, on traite comme un nom de couleur
      if (colorMap[colorInput]) {
        colorHex = colorMap[colorInput];
        return message.reply(`Le code hex de la couleur ${colorInput} est : ${colorHex}`);
      } else {
        return message.reply('Désolé, je ne connais pas cette couleur ! Exemple : `.color red`');
      }
    }
  },
};





