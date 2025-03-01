const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'rmrole',
  description: 'Enleve un ou plusieurs roles a un utilisateur',
  aliases: [],
  type: 'moderation',
  usage: '.rmrole {user} [roles]',
  async execute(client, message, args) {
    // Vérifie si l'utilisateur a la permission de gérer les rôles
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      console.log("Permission ManageRoles manquante pour l'utilisateur");
      return message.channel.send({ content: "❌ Tu n'as pas la permission de supprimer des rôles." });
    }

    // Vérifie si un utilisateur est mentionné
    const user = message.mentions.members.first();
    if (!user) {
      console.log("Aucun utilisateur mentionné");
      return message.channel.send({ content: "❌ Merci de mentionner un utilisateur." });
    }
    console.log(`Utilisateur mentionné : ${user.user.tag}`);

    // Force la récupération du bot pour contourner message.guild.me
    let botMember;
    try {
      botMember = await message.guild.members.fetch(client.user.id);
      console.log(`Bot récupéré : ${botMember.user.tag}, Rôles : ${botMember.roles.cache.size}`);
    } catch (error) {
      console.error("Erreur lors de la récupération du bot dans le serveur :", error);
      return message.channel.send({ content: "❌ Erreur interne : impossible de vérifier ma présence dans le serveur." });
    }

    // Rôles à conserver (Paysans et Server Booster)
    const rolesToKeep = ['1342898030105333833', '1343630168979411025']; // IDs des rôles Paysans et Server Booster

    // Vérifie si le bot a la permission Administrator (ignore la hiérarchie)
    const botHasAdmin = botMember.permissions.has(PermissionsBitField.Flags.Administrator);
    const botHighestRole = botMember.roles.highest;

    // Vérifie si l'argument "all" est utilisé
    if (args[1] && args[1].toLowerCase() === "all") {
      console.log("Suppression de tous les rôles sauf Paysans et Server Booster");

      const rolesToRemove = user.roles.cache.filter(
        role => !rolesToKeep.includes(role.id) && role.id !== message.guild.id
      );

      console.log(`Rôles à supprimer : ${rolesToRemove.size} rôle(s) trouvé(s)`);

      if (rolesToRemove.size === 0) {
        console.log("Aucun rôle à supprimer");
        return message.channel.send({ content: "❌ Cet utilisateur n'a pas d'autres rôles à retirer." });
      }

      try {
        for (const role of rolesToRemove.values()) {
          if (!botHasAdmin && role.position >= botHighestRole.position) {
            console.log(`Le rôle ${role.name} est trop élevé pour être supprimé (pas admin)`);
            continue;
          }
          console.log(`Tentative de suppression du rôle : ${role.name}`);
          await user.roles.remove(role);
          console.log(`Rôle supprimé : ${role.name}`);
        }

        return message.channel.send({
          content: `✅ Tous les rôles de **${user.user.tag}** ont été supprimés, sauf <@&${rolesToKeep[0]}> et <@&${rolesToKeep[1]}>.`,
        });
      } catch (error) {
        console.error("Erreur lors de la suppression des rôles : ", error);
        return message.channel.send({ content: "❌ Erreur lors de la suppression des rôles. Vérifie mes permissions." });
      }
    }

    // Récupérer tous les rôles mentionnés ou par ID
    const roles = new Set();

    message.mentions.roles.forEach(role => roles.add(role));
    console.log(`Rôles mentionnés : ${roles.size}`);

    args.forEach(arg => {
      if (arg.match(/^<@&\d+>$/)) {
        const roleId = arg.replace(/\D/g, '');
        const role = message.guild.roles.cache.get(roleId);
        if (role) {
          console.log(`Rôle ajouté par ID : ${role.name}`);
          roles.add(role);
        }
      }
    });

    const rolesArray = [...roles];
    if (rolesArray.length === 0) {
      console.log("Aucun rôle valide spécifié");
      return message.channel.send({ content: "❌ Merci de spécifier au moins un rôle valide (par mention ou ID)." });
    }

    // Vérifie la hiérarchie des rôles (sauf si le bot est admin)
    if (!botHasAdmin && rolesArray.some(role => role.position >= botHighestRole.position)) {
      console.log("Le bot n'a pas les permissions nécessaires pour supprimer certains rôles (pas admin)");
      return message.channel.send({ content: "❌ Je n'ai pas la permission de supprimer certains rôles (hiérarchie)." });
    }

    // Supprime les rôles spécifiés
    try {
      for (const role of rolesArray) {
        console.log(`Tentative de suppression du rôle : ${role.name}`);
        await user.roles.remove(role);
        console.log(`Rôle supprimé : ${role.name}`);
      }

      console.log(`Rôles supprimés : ${rolesArray.map(r => r.name).join(', ')}`);
      return message.channel.send({
        content: `✅ **${user.user.tag}** a perdu les rôles : ${rolesArray.map(r => `**${r.name}**`).join(', ')}.`,
      });
    } catch (error) {
      console.error("Erreur lors de la suppression des rôles : ", error);
      return message.channel.send({ content: "❌ Impossible de supprimer ces rôles. Vérifie mes permissions." });
    }
  },
};




