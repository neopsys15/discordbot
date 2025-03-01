const ticketHandler = require('../../handlers/tickethandler');

module.exports = {
  name: 'ticket',
  description: 'Gère le système de tickets',
  async execute(client, message, args) {
    const action = args[0]?.toLowerCase();

    switch(action) {
      case 'setup':
        await ticketHandler.setupTickets(message.channel);
        message.reply('Système de ticket configuré !');
        break;

      case 'close':
        try {
          await ticketHandler.closeTicket(message.channel);
        } catch (error) {
          message.reply(error.message);
        }
        break;

      default:
        message.reply('Utilisation : !ticket [setup|close]');
    }
  }
};