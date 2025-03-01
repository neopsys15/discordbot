const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
  // Initialiser le handler et les données
  init(client) {
    client.ticketData = new Map(); // Pour stocker les informations des tickets si besoin
  },

  // Configurer le système de tickets
  async setupTickets(channel) {
    const setupEmbed = {
      color: 0x0099ff,
      title: 'Système de Support',
      description: 'Sélectionnez une catégorie de ticket ci-dessous :',
      timestamp: new Date(),
    };

    const ticketMenu = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('ticket_select')
          .setPlaceholder('Choisissez une catégorie')
          .addOptions([
            {
              label: 'Gestion des abus',
              description: 'Signaler un problème ou un abus',
              value: 'abuse',
            },
            {
              label: 'Partenariat',
              description: 'Demande de partenariat',
              value: 'partnership',
            },
            {
              label: 'Candidature staff',
              description: 'Postuler pour rejoindre le staff',
              value: 'staff',
            },
          ]),
      );

    const setupMessage = await channel.send({
      embeds: [setupEmbed],
      components: [ticketMenu]
    });

    return setupMessage;
  },

  // Gérer la création des tickets
  async handleTicketCreation(interaction) {
    if (!interaction.isStringSelectMenu() || interaction.customId !== 'ticket_select') return;

    const ticketType = interaction.values[0];
    const user = interaction.user;
    const guild = interaction.guild;

    let ticketName, categoryName;
    switch(ticketType) {
      case 'abuse':
        ticketName = `ticket-abus-${user.username}`;
        categoryName = 'Gestion des abus';
        break;
      case 'partnership':
        ticketName = `ticket-part-${user.username}`;
        categoryName = 'Partenariats';
        break;
      case 'staff':
        ticketName = `ticket-staff-${user.username}`;
        categoryName = 'Candidatures Staff';
        break;
    }

    let category = guild.channels.cache.find(c => c.name === categoryName && c.type === 4);
    if (!category) {
      category = await guild.channels.create({
        name: categoryName,
        type: 4
      });
    }

    const ticketChannel = await guild.channels.create({
      name: ticketName,
      type: 0,
      parent: category.id,
      permissionOverwrites: [
        { id: guild.id, deny: ['ViewChannel'] },
        { id: user.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] },
        { id: interaction.client.user.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] },
        { id: '1342905100934447146', allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] },
        { id: '1342905685347926117', allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] },
      ],
    });

    const ticketEmbed = {
      color: 0x00ff00,
      title: `Ticket - ${categoryName}`,
      description: 'Décrivez votre demande ici. Utilisez `!ticket close` pour fermer.',
      timestamp: new Date(),
    };

    await ticketChannel.send({
      content: `<@${user.id}>`,
      embeds: [ticketEmbed],
    });

    await interaction.reply({
      content: `Ticket créé : ${ticketChannel}`,
      ephemeral: true
    });

    return ticketChannel;
  },

  // Fermer un ticket
  async closeTicket(channel) {
    if (!channel.name.startsWith('ticket-')) {
      throw new Error('Ce salon n\'est pas un ticket');
    }
    await channel.delete();
  }
};