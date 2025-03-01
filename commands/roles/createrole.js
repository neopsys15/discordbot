const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'createrole',
  description: 'Commande createrole',
  aliases: [],  
  type: 'roles',   
  usage: '.createrole',  
  async execute(client, message, args) {
    // Vérifie si l'utilisateur a la permission "Manage Roles"
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return message.reply("❌ Tu n'as pas la permission de créer des rôles personnalisés. Assure-toi d'avoir la permission 'Gérer les rôles'.");
    }

    // Si la commande est .help roleperso
    if (args[0] && args[0].toLowerCase() === "help") {
      return message.reply({
        content: `**Usage de la commande :** \n
          \`!roleperso "NomDuRôle" #HexCouleur [permissions]\`\n
          - **NomDuRôle** : Le nom du rôle entre guillemets (par exemple: "Modérateur").\n
          - **#HexCouleur** : La couleur du rôle en format hex (par exemple: #FF5733).\n
          - **Permissions** : Facultatif. Liste des permissions que tu veux attribuer au rôle. Par exemple: \`ADMINISTRATOR, MANAGE_MESSAGES\`. Les permissions sont séparées par des espaces.
        \n\n
        **Exemple de commande :** \n
        \`!roleperso "Modérateur" #FF5733 ADMINISTRATOR MANAGE_MESSAGES\``
      });
    }

    // Extraire le nom du rôle (tout ce qui est entre guillemets)
    const roleNameMatch = args.join(' ').match(/"([^"]+)"/); // Capture tout ce qui est entre guillemets
    if (!roleNameMatch) {
      return message.reply("❌ Tu dois spécifier un nom pour le rôle entre guillemets.");
    }
    const roleName = roleNameMatch[1]; // Le nom du rôle sans les guillemets

    // Vérifier la couleur (si elle est un code hex valide)
    const color = args[args.length - 1]; // Le dernier argument est la couleur
    const isValidHex = /^#[0-9A-Fa-f]{6}$/i.test(color) ? color : '#000000'; // Vérifier si c'est un hex valide

    // Vérifier les permissions (optionnel)
    const permissionsArray = args.slice(roleNameMatch.index + roleName.length, args.length - 1); // Les permissions sont tout ce qui reste après le nom du rôle et la couleur
    const permissions = permissionsArray.length ? PermissionsBitField.resolve(permissionsArray.join(' ')) : [];

    // Récupérer le rôle existant par son ID (ID de l'exemple donné)
    const roleToPositionAbove = await message.guild.roles.fetch('1343369157470584892'); // ID du rôle auquel on va ajouter le nouveau rôle juste au-dessus
    if (!roleToPositionAbove) {
      return message.reply("❌ Le rôle avec l'ID spécifié n'a pas été trouvé.");
    }

    // Créer le rôle
    try {
      const newRole = await message.guild.roles.create({
        name: roleName,
        color: isValidHex, // Utiliser la couleur valide
        permissions: permissions, // Permissions
        reason: 'Rôle créé via commande bot',
        position: roleToPositionAbove.position + 1 // Placer juste au-dessus du rôle existant
      });

      const roleEmbed = new EmbedBuilder()
        .setColor('#32CD32')
        .setTitle('Rôle créé avec succès')
        .setDescription(`Le rôle **${newRole.name}** a été créé avec la couleur **${newRole.color}**.`)
        .setTimestamp();

      // Envoi de l'embed dans le canal de log
      const logChannel = message.guild.channels.cache.get('1343551209788932146'); // ID du canal de logs
      logChannel.send({ embeds: [roleEmbed] });

      // Message de confirmation
      const confirmationMessage = await message.reply("✅ Le rôle a été créé avec succès !");

      // Suppression du message de confirmation après 5 secondes
      setTimeout(() => {
        confirmationMessage.delete();
      }, 5000);

    } catch (error) {
      console.error(error);
      message.reply("❌ Une erreur est survenue lors de la création du rôle.");
    }
  }
};





