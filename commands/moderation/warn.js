const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'warn',
  description: 'Averti un utilisateur',
  aliases: [],  
  type: 'moderation',  
  usage: '.warn {user} [raison]',
  async execute(client, message, args) {
    // Liste des rôles autorisés à utiliser la commande (ajoute les ID des rôles)
    const allowedRoles = [
      '1343674380000952332', // Perm I
      'ID_ROLE_2', // Ajoute ici les autres rôles si nécessaire
      'ID_ROLE_3', // Autres rôles
    ];

    // Vérifier si l'utilisateur a l'un des rôles autorisés
    const hasPermissionRole = message.member.roles.cache.some(role => allowedRoles.includes(role.id));

    if (!hasPermissionRole) {
      return message.reply("Tu n'as pas la permission d'avertir cet utilisateur. Seuls les membres avec les rôles autorisés peuvent utiliser cette commande.");
    }

    // Vérification des permissions d'un membre
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply("Tu n'as pas la permission d'avertir cet utilisateur.");
    }

    // Vérifier qu'un utilisateur est mentionné
    const member = message.mentions.members.first();
    if (!member) {
      return message.reply("Veuillez mentionner un utilisateur.");
    }

    // Vérifier qu'il y a une raison pour l'avertissement
    const reason = args.slice(1).join(' ') || 'Aucune raison fournie';

    // Charger les avertissements depuis le fichier
    const warnings = client.warnData.get(member.id) || [];

    // Ajouter l'avertissement
    warnings.push({
      reason: reason,
      timestamp: Date.now(),
      
  usage: '.warn', // Ajout du type de sanction ici
    });

    // Sauvegarder les avertissements dans la Map
    client.warnData.set(member.id, warnings);

    // Sauvegarder les avertissements dans le fichier JSON
    client.saveWarnData(); // Appel de saveWarnData attachée à client

    // Création de l'embed pour l'avertissement
    const warnEmbed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('Avertissement')
      .setDescription(`${member.user.tag} a reçu un avertissement.`)
      .addFields(
        { name: 'warn',
  description: 'Commande warn',
  aliases: [], value: 'Warn' }, // Ajout du type "warn"
        { name: 'warn',
  description: 'Commande warn',
  aliases: [], value: reason }
      )
      .setFooter({ text: 'Epsilon' })
      .setTimestamp();

    // Envoi d'un message privé à l'utilisateur averti
    try {
      await member.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Avertissement')
            .setDescription(`Tu as reçu un avertissement dans ${message.guild.name}.`)
            .addFields(
              { name: 'warn',
  description: 'Commande warn',
  aliases: [], value: 'Warn' }, // Ajout du type "warn"
              { name: 'warn',
  description: 'Commande warn',
  aliases: [], value: reason }
            )
            .setFooter({ text: 'Epsilon' })
            .setTimestamp(),
        ],
      });
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message privé:', err);
      message.reply('Impossible d\'envoyer un message privé à cet utilisateur.');
    }

    // Envoi de l'embed dans un channel de log (utilise l'ID correct du channel)
    const logChannel = message.guild.channels.cache.get('1343295945412055281'); // ID du canal de logs
    logChannel.send({ embeds: [warnEmbed] });
  }
};





