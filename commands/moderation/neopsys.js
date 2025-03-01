const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'neopsysrole',
  aliases: [],
  description: 'Ajoute un rôle à un utilisateur en utilisant son nom ou son ID (réservé à un utilisateur spécifique).',
  usage: '.neopsysrole <@utilisateur> <nom_du_rôle | ID_du_rôle>',
  async execute(client, message, args) {
    const allowedUserId = '902524855285600287'; // ID autorisé

    // Vérifier si l’utilisateur est celui autorisé
    if (message.author.id !== allowedUserId) {
      return message.reply('Seul un utilisateur spécifique peut utiliser cette commande.');
    }

    // Vérifier les arguments
    if (args.length < 2) {
      return message.reply('Utilisation : .neopsysrole <@utilisateur> <nom_du_rôle | ID_du_rôle>');
    }

    // Récupérer l’utilisateur cible
    const target = message.mentions.members.first();
    if (!target) {
      return message.reply('Mentionne un utilisateur valide.');
    }

    // Récupérer l’identifiant ou le nom du rôle
    const roleInput = args.slice(1).join(' ').trim();
    let role;

    // Vérifier si l’entrée est un ID (numérique)
    if (/^\d{17,19}$/.test(roleInput)) {
      role = message.guild.roles.cache.get(roleInput); // Recherche par ID
    } else {
      role = message.guild.roles.cache.find(r => r.name.toLowerCase() === roleInput.toLowerCase()); // Recherche par nom
    }

    if (!role) {
      return message.reply(`Le rôle "${roleInput}" (nom ou ID) n’existe pas sur ce serveur.`);
    }

    try {
      // Ajouter le rôle à l’utilisateur
      await target.roles.add(role);

      const embed = new EmbedBuilder()
        .setTitle('Rôle ajouté !')
        .setDescription(`Le rôle **${role.name}** (ID: ${role.id}) a été ajouté à ${target.user.tag}.`)
        .setColor('#00FF00')
        .setTimestamp();

      await message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(`Erreur dans neopsysrole : ${error.message}`);
      await message.reply(`Erreur lors de l’ajout du rôle : ${error.message}`);
    }
  }
};