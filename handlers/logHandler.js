const { EmbedBuilder } = require('discord.js');

module.exports = {
  handlePrivateMessage: async (client, message) => {
    const now = Date.now();
    const userId = message.author.id;
    const userData = client.dmSpamData.get(userId) || { messages: [], blockedUntil: null };

    if (userData.blockedUntil && now < userData.blockedUntil) return;
    if (userData.blockedUntil && now >= userData.blockedUntil) {
      userData.blockedUntil = null;
      await message.author.send("🚫 **Tu as été débloqué et peux à nouveau envoyer des messages en MP.**");
      const logChannel = client.channels.cache.get('1343255191700635668');
      if (logChannel) logChannel.send(`🟢 **${message.author.tag} a été débloqué après 5 minutes de spam en MP.**`);
    }

    userData.messages = userData.messages.filter(ts => now - ts < 5000);
    userData.messages.push(now);

    if (userData.messages.length > 5) {
      userData.blockedUntil = now + 5 * 60 * 1000;
      await message.author.send("🚫 **Tu as été bloqué d'envoyer des messages en MP pendant 5 minutes pour spam !**");
      const logChannel = client.channels.cache.get('1343255191700635668');
      if (logChannel) logChannel.send(`🔴 **${message.author.tag} a été bloqué pour spam en MP pendant 5 minutes.**`);
    }
    client.dmSpamData.set(userId, userData);

    const priveChannel = client.channels.cache.get('1343568011348676742');
    if (priveChannel) {
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
        .setDescription(message.content)
        .setFooter({ text: `ID Utilisateur: ${message.author.id}` })
        .setTimestamp();
      await priveChannel.send({ embeds: [embed] });
      await priveChannel.send(message.author.id);
    }
  },
};