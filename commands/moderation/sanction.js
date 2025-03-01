const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'sanction',
  description: 'Affiche les sanctions de l\'utilisateur',
  aliases: [],
  type: 'moderation',
  usage: '.sanction {user}',
  async execute(client, message, args) {
    // Vérifier si la commande est exécutée en serveur
    if (!message.guild) {
      return message.reply("❌ Cette commande ne peut être utilisée qu'en serveur.");
    }

    // Vérifier si l'utilisateur a les permissions nécessaires (Permission I et plus)
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply("🚫 Tu n'as pas la permission d'utiliser cette commande !");
    }

    // Vérifier si des arguments sont fournis
    if (!args[0]) {
      return message.reply("❌ Utilisation incorrecte ! Essaye `.sanction @user` ou `.sanction userID`.");
    }

    // Récupérer la cible mentionnée ou via ID
    const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!target) {
      return message.reply("❌ Utilisateur introuvable. Assure-toi que l'utilisateur est bien dans le serveur.");
    }

    // Vérifier si la base de données des sanctions existe
    if (!client.warnData) {
      return message.reply("⚠️ Erreur interne : Impossible de récupérer les sanctions.");
    }

    // Récupérer les sanctions de l'utilisateur
    const userSanctions = client.warnData.get(target.id) || [];

    if (userSanctions.length === 0) {
      return message.reply(`✅ **${target.user.tag}** n'a aucune sanction.`);
    }

    // Formater les sanctions pour l'embed
    let sanctionsList = userSanctions.map((sanction, index) => {
      const date = `<t:${Math.floor((sanction.timestamp || Date.now()) / 1000)}:F>`;
      const type = sanction.type ? sanction.type.toLowerCase() : "Inconnue";
      const reason = sanction.reason || "Aucune raison spécifiée";
      return `**${index + 1}-** ${date} - **${type}** - ${reason}`;
    }).join("\n");

    // Créer l'embed des sanctions
    const embed = new EmbedBuilder()
      .setColor('Red')
      .setTitle(`📋 Sanctions de ${target.user.tag}`)
      .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
      .setDescription(sanctionsList)
      .setTimestamp()
      .setFooter({ text: `Total : ${userSanctions.length} sanction(s)` });

    // Envoyer l'embed
    return message.reply({ embeds: [embed] });
  }
};





