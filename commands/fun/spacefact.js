
module.exports = {
  name: 'spacefact',
  description: 'Envoie des faits sur l\'espace',
  aliases: [],
  type: 'fun',  
  usage: '.spacefact',
  async execute(client, message, args) {
    try {
      const response = await fetch('https://api.le-systeme-solaire.net/rest/bodies/');
      const data = await response.json();
      const randomFact = data.bodies[Math.floor(Math.random() * data.bodies.length)];

      message.channel.send({
        embeds: [{
          title: `🚀 Fait sur l’espace : ${randomFact.englishName}`,
          description: randomFact.discoveredBy ? `Découvert par : **${randomFact.discoveredBy}**` : "Découvreur inconnu.",
          footer: { text: `Date de découverte : ${randomFact.discoveryDate || "Inconnue"}` }
        }]
      });
    } catch (error) {
      console.error(error);
      message.channel.send("❌ Impossible de récupérer un fait sur l’espace.");
    }
  }
};





