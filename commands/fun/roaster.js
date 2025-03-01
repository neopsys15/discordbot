module.exports = {
  name: 'roaster',
  description: 'Roast un utilisateur',
  aliases: [],
  type: 'fun',
  usage: '.roaster {mention}',
  async execute(client, message, args) {
      const target = message.mentions.users.first();
      if (!target) {
        return message.channel.send("❌ Mentionne quelqu'un à insulter !");
      }
  
      const roasts = [
        "T'es aussi utile qu'un chargeur Nokia en 2024.",
        "Même Google a du mal à trouver ton talent.",
        "Ton cerveau est en mode avion depuis la naissance.",
        "T'es le genre de personne qui met du lait avant les céréales.",
        "Ton WiFi est plus rapide que ta réflexion."
      ];
  
      const roast = roasts[Math.floor(Math.random() * roasts.length)];
      message.channel.send(`🔥 **${target.username},** ${roast}`);
    }
  };
  




