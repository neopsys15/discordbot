const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { description, aliases } = require("./help");

// Charger l'image du dé
const diceImg = new AttachmentBuilder('./assets/img/dice.jpg');

const randomDice = () => Math.floor(Math.random() * 6) + 1;

module.exports = {
  name: 'dice',  
  description: 'Lance 6 dé',
  aliases: [],
  type: 'utilities',  
  usage: '.dice',
  execute(client, message, args) {
    const embed = new EmbedBuilder()
      .setColor("#006c35")
      .setTitle("🎲 Random Dice 🎲")
      .setThumbnail('attachment://dice.jpg') // Utilisation correcte avec les fichiers
      .addFields(
        { name: 'D#1', value: `${randomDice()}`, inline: true },
        { name: 'D#2', value: `${randomDice()}`, inline: true },
        { name: 'D#3', value: `${randomDice()}`, inline: true }
      )
      .addFields(
        { name: 'D#4', value: `${randomDice()}`, inline: true },
        { name: 'D#5', value: `${randomDice()}`, inline: true },
        { name: 'D#6', value: `${randomDice()}`, inline: true }
      );

    // Envoyer l'embed avec l'image
    message.channel.send({ embeds: [embed], files: [diceImg] });
  }
};




