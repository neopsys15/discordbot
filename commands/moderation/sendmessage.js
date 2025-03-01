const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'sendmessage',
  description: 'Envoie un message avec le bot', 
  type: 'moderation',
  aliases: ['sm'],
  usage: '.sendmessage {user/salon} [message]',
  async execute(client, message, args) {
    // Liste des IDs des rôles autorisés à utiliser la commande
    const allowedRoleIds = ['1342898552094851182', '1342898581975339038'];

    // Vérifier si l'utilisateur a l'un des rôles autorisés
    const hasRequiredRole = message.member.roles.cache.some(role => allowedRoleIds.includes(role.id));

    // Vérifier si l'utilisateur a l'un des rôles nécessaires ou la permission de gérer les messages
    if (!hasRequiredRole && !message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply("❌ Tu n'as pas la permission d'utiliser cette commande.");
    }

    // Vérifier si l'utilisateur a la permission d'envoyer des messages
    if (!message.member.permissions.has(PermissionsBitField.Flags.SendMessages)) {
      return message.reply("❌ Tu n'as pas la permission d'envoyer des messages.");
    }

    let responseMessage;

    // Si la commande est utilisée en réponse à un message
    if (message.reference) {
      const referencedMessage = await message.fetchReference();
      const userIdMatch = referencedMessage.content.match(/^(\d{17,19})$/); // Cherche un ID utilisateur

      if (userIdMatch) {
        const targetId = userIdMatch[1]; // Récupère l'ID de l'utilisateur à qui envoyer le message
        const target = await client.users.fetch(targetId).catch(() => null);

        if (target) {
          const content = args.join(' '); // Le contenu du message à envoyer

          if (!content) {
            return message.reply("❌ Merci de spécifier le message à envoyer.");
          }

          try {
            const dm = await target.createDM();
            await dm.send(content);
            // Réponse dans le salon avec un message de confirmation
            responseMessage = await message.reply(`✅ Message envoyé en privé à ${target.tag}.`);
            setTimeout(() => responseMessage.delete().catch(console.error), 5000); // Suppression après 5 sec

            // Ajouter une réaction ✅ au message de commande
            await message.react('✅');  // Réaction ✅
          } catch (err) {
            responseMessage = await message.reply(`❌ Impossible d'envoyer un MP à ${target.tag}.`);
            setTimeout(() => responseMessage.delete().catch(console.error), 5000); // Suppression après 5 sec

            // Ajouter une réaction ❌ au message de commande
            await message.react('❌');  // Réaction ❌
          }
        } else {
          return message.reply("❌ L'ID d'utilisateur mentionné n'est pas valide.");
        }
      } else {
        return message.reply("❌ Aucun ID utilisateur trouvé dans le message auquel tu as répondu.");
      }
    } else {
      // Cas où on n'est pas en réponse à un message, on vérifie la mention d'un utilisateur ou d'un salon
      if (!args[0]) {
        return message.reply("❌ Merci de spécifier un salon, un utilisateur ou un ID.");
      }

      const content = args.slice(1).join(' '); // Le message à envoyer

      if (!content) {
        return message.reply("❌ Merci de spécifier le message à envoyer.");
      }

      let target;

      // Vérifier si un salon est mentionné
      if (message.mentions.channels.size > 0) {
        target = message.mentions.channels.first();
        await target.send(content);
        // Réponse dans le salon avec un message de confirmation
        responseMessage = await message.reply(`✅ Message envoyé dans le salon ${target.name}.`);
        setTimeout(() => responseMessage.delete().catch(console.error), 5000); // Suppression après 5 sec

        // Ajouter une réaction ✅ au message de commande
        await message.react('✅');  // Réaction ✅
        return;
      }

      // Vérifier si un utilisateur est mentionné
      if (message.mentions.users.size > 0) {
        target = message.mentions.users.first();
        try {
          const dm = await target.createDM();
          await dm.send(content);
          // Réponse dans le salon avec un message de confirmation
          responseMessage = await message.reply(`✅ Message envoyé en privé à ${target.tag}.`);
          setTimeout(() => responseMessage.delete().catch(console.error), 5000); // Suppression après 5 sec

          // Ajouter une réaction ✅ au message de commande
          await message.react('✅');  // Réaction ✅
        } catch (err) {
          responseMessage = await message.reply(`❌ Impossible d'envoyer un MP à ${target.tag}.`);
          setTimeout(() => responseMessage.delete().catch(console.error), 5000); // Suppression après 5 sec

          // Ajouter une réaction ❌ au message de commande
          await message.react('❌');  // Réaction ❌
        }
      }

      // Vérifier si un ID utilisateur est fourni
      if (args[0].match(/^(\d{17,19})$/)) {
        const targetId = args[0];
        target = await client.users.fetch(targetId).catch(() => null);
        if (target) {
          try {
            const dm = await target.createDM();
            await dm.send(content);
            // Réponse dans le salon avec un message de confirmation
            responseMessage = await message.reply(`✅ Message envoyé en privé à ${target.tag}.`);
            setTimeout(() => responseMessage.delete().catch(console.error), 5000); // Suppression après 5 sec

            // Ajouter une réaction ✅ au message de commande
            await message.react('✅');  // Réaction ✅
          } catch (err) {
            responseMessage = await message.reply(`❌ Impossible d'envoyer un MP à **${target.tag}**. L'utilisateur a peut-être désactivé ses messages privés.`);
            setTimeout(() => responseMessage.delete().catch(console.error), 5000); // Suppression après 5 sec

            // Ajouter une réaction ❌ au message de commande
            await message.react('❌');  // Réaction ❌
          }
        } else {
          return message.reply("❌ Aucun utilisateur trouvé avec cet ID.");
        }
      }
    }
  }
};





