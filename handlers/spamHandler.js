const { REST, Routes } = require('discord.js');
const fs = require('fs');

module.exports = {
  loadWarnData: (client) => {
    if (fs.existsSync('./warnData.json')) {
      try {
        const data = JSON.parse(fs.readFileSync('./warnData.json', 'utf-8'));
        client.warnData = new Map(data);
      } catch (err) {
        console.error("Erreur lors du chargement des avertissements:", err);
      }
    }
  },

  saveWarnData: (client) => {
    fs.writeFileSync('./warnData.json', JSON.stringify([...client.warnData]), 'utf-8');
  },

  handleSpam: async (client, message) => {
    const now = Date.now();
    const userData = client.spamData.get(message.author.id) || { messages: [] };
    userData.messages = userData.messages.filter(ts => now - ts < 5000);
    userData.messages.push(now);

    if (userData.messages.length > 5) {
      const messages = await message.channel.messages.fetch({ limit: 100 });
      const recentMessages = messages.filter(m => m.author.id === message.author.id && Date.now() - m.createdTimestamp < 5000);
      await message.channel.bulkDelete(recentMessages);

      const userId = message.author.id;
      if (!client.warnData.has(userId)) client.warnData.set(userId, []);
      client.warnData.get(userId).push({ type: 'spam', timestamp: now });
      module.exports.saveWarnData(client);

      const userWarnings = client.warnData.get(userId).filter(w => w.type === 'spam').length;
      const warningMessage = await message.channel.send(`⚠️ ${message.author}, Calme toi sur le spam !`);
      setTimeout(() => warningMessage.delete().catch(() => {}), 5000);

      if (userWarnings >= 5) message.channel.send(`🚨 **${message.author.tag} a atteint 5 avertissements pour spam !**`);
    }
    client.spamData.set(message.author.id, userData);
  },

  registerSlashCommands: async (client, token, clientId, slashCommands) => {
    const rest = new REST({ version: '10' }).setToken(token);
    try {
      console.log('🔄 Enregistrement des commandes slash...');
      await rest.put(Routes.applicationCommands(clientId), { body: slashCommands });
      console.log('✅ Commandes slash enregistrées !');
    } catch (error) {
      console.error('❌ Erreur lors de l’enregistrement des commandes slash :', error);
    }
  },
};