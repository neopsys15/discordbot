module.exports = {
  name: '8ball',
  description: 'Pose une question et laisse la Boule te dire l\'avenir',  
  type: 'fun',
  aliases: ['8b'],  
  usage: '.8ball [question]',
  async execute(client, message, args) {
    if (!args.length) {
      return message.channel.send("❌ Pose une question !");
    }

    const responses = [
      "Oui !", "Non...", "Peut-être", "Bien sûr !", "Jamais.", 
      "C'est très probable.", "Je ne pense pas.", "Demande plus tard."
    ];

    const reply = responses[Math.floor(Math.random() * responses.length)];
    message.channel.send(`🎱 **Réponse :** ${reply}`);
  }
};





