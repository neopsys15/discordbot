module.exports = {
    name: 'reminder',
    description: 'Définit un rappel après un certain temps',
    execute(message, args) {
      const time = args[0];
      const reminderMsg = args.slice(1).join(' ');
      if (!time || !reminderMsg) return message.reply('Format : !reminder <temps> <message>');
  
      const timeMs = parseTime(time); // Fonction à créer pour convertir "30m" en ms
      if (!timeMs) return message.reply('Temps invalide (ex: 5m, 1h, 2d)');
  
      message.reply(`Rappel défini pour dans ${time}.`);
      setTimeout(() => {
        message.reply(`Rappel : ${reminderMsg}`);
      }, timeMs);
    }
  };
  
  function parseTime(input) {
    const regex = /^(\d+)([smhd])$/;
    const match = input.match(regex);
    if (!match) return null;
    const value = parseInt(match[1]);
    const unit = match[2];
    return value * (unit === 's' ? 1000 : unit === 'm' ? 60000 : unit === 'h' ? 3600000 : 86400000);
  }