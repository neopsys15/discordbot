const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'rolecreate',
  description: 'Commande rolecreate',
  aliases: [],  
  type: 'roles',  
  usage: '.rolecreate',  
  async execute(client, message, args) {
    // Vérifie si l'utilisateur a la permission "Manage Roles"
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return message.reply("❌ Tu n'as pas la permission de créer des rôles personnalisés. Assure-toi d'avoir la permission 'Gérer les rôles'.");
    }

    // Si la commande est .help roletype
    if (args[0] && args[0].toLowerCase() === "help") {
      return message.reply({
        content: `**Usage de la commande :** \n
          \`!roletype "NomDuRôle1" [Couleur] "NomDuRôle2" [Couleur] ...\`\n
          - **NomDuRôle** : Le nom du rôle que tu veux créer, comme "Mineur", "Majeur", etc. (par exemple: "Mineur").\n
          - **Couleur** : Facultatif. La couleur du rôle en format hex (par exemple: #FF5733). Si non spécifiée, une couleur par défaut sera utilisée.
        \n\n
        **Exemple de commande :** \n
        \`!roletype "Mineur" #FF5733 "Majeur" #32CD32\``
      });
    }

    // Vérification des rôles et de leur couleur
    const rolesData = [];
    let i = 0;

    while (i < args.length) {
      const roleNameMatch = args[i].match(/"([^"]+)"/); // Extraire le nom du rôle entre guillemets
      if (roleNameMatch) {
        let roleName = roleNameMatch[1]; // Nom du rôle avec espaces inclus
        roleName = roleName.replace(/_/g, ' '); // Remplacer les underscores par des espaces
        const color = args[i + 1] && /^#[0-9A-Fa-f]{6}$/i.test(args[i + 1]) ? args[i + 1] : '#0099FF'; // Couleur valide ou couleur par défaut
        rolesData.push({ name: roleName, color });
        i += 2; // Passer à l'argument suivant (la couleur)
      } else {
        return message.reply("❌ Tu dois spécifier un nom de rôle valide entre guillemets.");
      }
    }

    // Si aucun rôle à créer
    if (rolesData.length === 0) {
      return message.reply("❌ Aucune donnée valide pour créer des rôles. Utilise `!roletype help` pour plus d'informations.");
    }

    // Créer les rôles
    try {
      const createdRoles = [];
      for (const roleData of rolesData) {
        const newRole = await message.guild.roles.create({
          name: roleData.name,
          color: roleData.color, // Utiliser la couleur validée
          reason: `Rôle créé via commande bot`,
          position: 1, // Placer le rôle au début
        });

        createdRoles.push(newRole);
      }

      // Mentionner les rôles créés
      const mentionedRoles = createdRoles.map(role => `<@&${role.id}>`).join(', ');

      // Embeds pour afficher les rôles créés
      const roleNames = createdRoles.map(role => `**${role.name}** (Couleur: ${role.color})`).join('\n');
      const roleEmbed = new EmbedBuilder()
        .setColor('#32CD32')
        .setTitle('Rôles créés avec succès')
        .setDescription(`Les rôles suivants ont été créés :\n\n${roleNames}`)
        .setTimestamp();

      // Envoi de l'embed dans le canal de log
      const logChannel = message.guild.channels.cache.get('1343551209788932146'); // ID du canal de logs
      if (logChannel) {
        await logChannel.send({ embeds: [roleEmbed] });
      } else {
        return message.reply("❌ Le canal de log n'a pas été trouvé.");
      }

      // Message de confirmation avec mention des rôles créés
      const confirmationMessage = await message.reply(`✅ Les rôles ont été créés avec succès ! Voici les rôles créés : ${mentionedRoles}`);

      // Suppression du message de confirmation après 5 secondes
      setTimeout(() => {
        confirmationMessage.delete();
      }, 5000);

    } catch (error) {
      console.error(error);
      return message.reply("❌ Une erreur est survenue lors de la création des rôles. Vérifie si la commande est correcte et réessaie.");
    }
  }
};





