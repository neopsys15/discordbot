const { PermissionsBitField } = require('discord.js');  // Ajout de l'importation nécessaire

module.exports = {
  name: 'mute',
  description: 'Mute un utilisateur',
  aliases: [],  
  type: 'moderation',
  usage: '.mute {user} [duration]',
    async execute(client, message, args) {
        // Vérifie si l'utilisateur a la permission de mute (Permission II et plus)
        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return message.channel.send({ content: "❌ Tu n'as pas la permission de mute des membres." });
        }

        const user = message.mentions.members.first();
        if (!user) return message.channel.send({ content: "❌ Merci de mentionner un utilisateur à mute." });

        let muteRole = message.guild.roles.cache.find(role => role.name === "Muted");
        if (!muteRole) return message.channel.send({ content: "❌ Le rôle `Muted` n'existe pas sur ce serveur." });

        // Vérification du temps pour le mute (format : '1h', '30m', '15s')
        const timeArg = args[1];
        let muteDuration = 0; // Durée en millisecondes

        if (timeArg) {
            const timePattern = /^(\d+)([smh])$/; // Accepte s (secondes), m (minutes), h (heures)
            const matches = timeArg.match(timePattern);
            if (matches) {
                const value = parseInt(matches[1]);
                const unit = matches[2];

                switch (unit) {
                    case 's': muteDuration = value * 1000; break;  // secondes
                    case 'm': muteDuration = value * 60 * 1000; break;  // minutes
                    case 'h': muteDuration = value * 60 * 60 * 1000; break;  // heures
                    default: break;
                }
            }
        }

        // Si une durée valide est fournie, appliquer le mute
        try {
            // Ajouter le rôle "Muted" à l'utilisateur
            await user.roles.add(muteRole);

            // Envoi d'un message dans le canal où la commande a été utilisée
            message.channel.send({ content: `🔇 **${user.user.tag}** a été mute pendant ${timeArg}.` });

            // Envoi d'un message privé à l'utilisateur
            await user.send({
                content: `Tu as été mute sur le serveur ${message.guild.name}.\n\nRaison : **Raison non fournie**\n\nTu ne peux plus envoyer de messages tant que cette sanction est en place.`
            });

            if (muteDuration > 0) {
                // Retirer le rôle Muted après le délai spécifié
                setTimeout(async () => {
                    try {
                        await user.roles.remove(muteRole);
                        await user.send({ content: `Ton mute a été levé sur ${message.guild.name}.` });
                        message.channel.send({ content: `🔊 **${user.user.tag}** n'est plus mute.` });
                    } catch (err) {
                        console.error('Erreur lors de la levée du mute:', err);
                        message.channel.send({ content: "❌ Impossible de retirer le mute de cet utilisateur." });
                    }
                }, muteDuration);
            }

        } catch (err) {
            console.error('Erreur lors de l\'ajout du rôle Muted:', err);
            message.channel.send({ content: "❌ Impossible de mute cet utilisateur." });
        }
    }
};





