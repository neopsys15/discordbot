const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'addrole',
  description: 'Créer un ou plusieur role',
  aliases: [],  
  type: 'roles',  
  usage: '.addrole [role] {couleur}',  
  execute(client, message, args) {
    // Vérifie si l'utilisateur a la permission de gérer les rôles
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return message.channel.send({ content: "❌ Tu n'as pas la permission d'ajouter des rôles." });
    }

    // Vérifie si un utilisateur est mentionné
    const user = message.mentions.members.first();
    if (!user) return message.channel.send({ content: "❌ Merci de mentionner un utilisateur." });

    // Récupérer tous les rôles mentionnés
    let roles = new Set(); // Utilisation d'un Set pour éviter les doublons

    message.mentions.roles.forEach(role => roles.add(role));

    args.forEach(arg => {
      if (arg.match(/^<@&\d+>$/)) {
        let roleId = arg.replace(/\D/g, '');
        let role = message.guild.roles.cache.get(roleId);
        if (role) roles.add(role);
      }
    });

    roles = [...roles]; // Convertir le Set en tableau

    if (roles.length === 0) {
      return message.channel.send({ content: "❌ Merci de spécifier au moins un rôle valide (par mention ou ID)." });
    }

    // Ajoute les rôles à l'utilisateur
    user.roles.add(roles)
      .then(() => message.channel.send({ content: `✅ **${user.user.tag}** a reçu les rôles : ${roles.map(r => `**${r.name}**`).join(', ')}.` }))
      .catch(err => {
        console.error(err);
        message.channel.send({ content: "❌ Impossible d'ajouter ces rôles. Vérifie que le bot a les permissions nécessaires." });
      });
  }
};





