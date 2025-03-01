module.exports = {
  name: 'hack',
  description: 'Hack un utilisateur',
  aliases: [],  
  type: 'fun',   
  usage: '.hack {mention}',
  async execute(client, message, args) {
      const target = message.mentions.users.first();
      if (!target) {
        return message.channel.send("❌ Mentionne quelqu'un à hacker !");
      }
  
      const steps = [
        `🔍 Recherche des informations sur **${target.username}**...`,
        `📡 Connexion au serveur de **${target.username}**...`,
        `🔑 Décryptage du mot de passe...`,
        `💳 Récupération des cartes bancaires...`,
        `📤 Envoi des données aux hackers...`,
        `✅ Hack terminé avec succès !`
      ];
  
      let index = 0;
      const interval = setInterval(() => {
        if (index < steps.length) {
          message.channel.send(steps[index]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 2000);
    }
  };
  




