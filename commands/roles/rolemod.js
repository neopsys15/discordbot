const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'rolemod',
  description: 'Commande rolemod',    
  type: 'roles',  // Nom principal de la commande
  aliases: ['rolemod'],     // Alias "roleadd"  
  usage: '.rolemod',
    async execute(client, message, args) {
        // Vérifie si l'utilisateur a la permission de gérer les rôles (Permission III et plus)
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return message.reply("❌ Tu n'as pas la permission d'ajouter ce rôle.");
        }

        // Vérifier qu'un utilisateur est mentionné
        const member = message.mentions.members.first();
        if (!member) {
            return message.reply("❌ Veuillez mentionner un utilisateur.");
        }

        // Vérifier qu'un rôle est mentionné
        const roleMention = message.mentions.roles.first();
        if (!roleMention) {
            return message.reply("❌ Veuillez spécifier un rôle à ajouter.");
        }

        // Définir les permissions associées au rôle mentionné
        let permissionsToAdd = [];

        // Rôles et permissions associées
        switch (roleMention.id) {
            case '1342934163610796043':  // ID du rôle chevalier-test
                permissionsToAdd = ['1343674380000952332'];  // Perm I
                break;
            case '1342920444390412368':  // ID du rôle chevalier
                permissionsToAdd = ['1343674380000952332', '1343674869417508895'];  // Perm I + Perm II
                break;
            case '1342905100934447146':  // ID du rôle empereur
                permissionsToAdd = [
                    '1343674380000952332',  // Perm I
                    '1343674869417508895',  // Perm II
                    '1343675934540042252'   // Perm III
                ];
                break;
            default:
                return message.reply("❌ Le rôle spécifié n'est pas valide.");
        }

        try {
            // Ajouter le rôle mentionné à l'utilisateur
            await member.roles.add(roleMention);

            // Ajouter les permissions associées à l'utilisateur
            for (const perm of permissionsToAdd) {
                await member.roles.add(perm);
            }

            // Mentionner le rôle dans la réponse
            const roleMentionText = `<@&${roleMention.id}>`;

            message.reply(`${member.user.tag} a maintenant le rôle ${roleMentionText} et les permissions associées.`);
        } catch (error) {
            console.error(error);
            message.reply("❌ Une erreur est survenue lors de l'ajout des rôles et permissions.");
        }
    },
};





