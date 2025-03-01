const fs = require('fs');
const path = require('path');

module.exports = (client) => {
  // Charger les commandes classiques (slashCommands et autres)
  const commandFolders = ['commands', 'slashCommands'];

  client.commands = new Map();

  // Boucler sur chaque dossier de commande
  commandFolders.forEach((folder) => {
    const commandFiles = fs.readdirSync(path.join(__dirname, '..', folder)).filter(file => file.endsWith('.js'));

    commandFiles.forEach((file) => {
      const command = require(path.join(__dirname, '..', folder, file));
      client.commands.set(command.data.name, command); // Assurer que tu as .data.name pour les commandes slash
    });
  });
};
