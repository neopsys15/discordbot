const { Client, Collection, GatewayIntentBits, Partials, REST, Routes } = require('discord.js');
const { TOKEN, PREFIX, CLIENT_ID } = require('./config');
const fs = require('fs');
require('dotenv').config();

// Handlers
const spamHandler = require('./handlers/spamHandler');
const voiceHandler = require('./handlers/voiceHandler');
const logHandler = require('./handlers/logHandler');
const roleHandler = require('./handlers/roleHandler');
const ticketHandler = require('./handlers/tickethandler');

// Initialisation du client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

// Collections et données
client.commands = new Collection();
client.slashCommands = new Collection();
client.spamData = new Map();
client.warnData = new Map();
client.dmSpamData = new Map();

// Initialisation des handlers
spamHandler.loadWarnData(client);
ticketHandler.init(client);

// Charger les commandes classiques depuis les sous-dossiers
const loadCommands = (dir) => {
  const categories = fs.readdirSync(dir, { withFileTypes: true });
  for (const category of categories) {
    if (!category.isDirectory()) continue;
    const commandFiles = fs.readdirSync(`${dir}/${category.name}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const command = require(`${dir}/${category.name}/${file}`);
      client.commands.set(command.name, command);
      if (command.aliases) {
        command.aliases.forEach(alias => client.commands.set(alias, command));
      }
      console.log(`Commande chargée : ${command.name} (catégorie: ${category.name})`);
    }
  }
  console.log(`Total commandes chargées : ${client.commands.size}`);
};
loadCommands('./commands');

// Charger les commandes slash depuis les sous-dossiers ET la racine
const loadSlashCommands = (dir) => {
  const slashCommands = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });

  // Charger les fichiers directement dans slashCommands/
  for (const file of files) {
    if (file.isFile() && file.name.endsWith('.js')) {
      const slashCommand = require(`${dir}/${file.name}`);
      client.slashCommands.set(slashCommand.data.name, slashCommand);
      slashCommands.push(slashCommand.data.toJSON());
      console.log(`Commande slash chargée : ${slashCommand.data.name} (racine)`);
    }
  }

  // Charger les fichiers dans les sous-dossiers
  const categories = files.filter(f => f.isDirectory());
  for (const category of categories) {
    const slashFiles = fs.readdirSync(`${dir}/${category.name}`).filter(file => file.endsWith('.js'));
    for (const file of slashFiles) {
      const slashCommand = require(`${dir}/${category.name}/${file}`);
      client.slashCommands.set(slashCommand.data.name, slashCommand);
      slashCommands.push(slashCommand.data.toJSON());
      console.log(`Commande slash chargée : ${slashCommand.data.name} (catégorie: ${category.name})`);
    }
  }

  console.log(`Total commandes slash chargées : ${client.slashCommands.size}`);
  return slashCommands;
};
const slashCommands = loadSlashCommands('./slashCommands');

// Événements
client.on('ready', async () => {
  console.log(`Bot connecté en tant que ${client.user.tag}`);
  
  const rest = new REST({ version: '10' }).setToken(TOKEN);
  try {
    console.log('Début de l’enregistrement des commandes slash...');
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, '1342896153380786206'),
      { body: slashCommands }
    );
    console.log('Commandes slash enregistrées avec succès pour le serveur !');
  } catch (error) {
    console.error('Erreur lors de l’enregistrement des commandes slash :', error);
  }

  await spamHandler.registerSlashCommands(client, TOKEN, CLIENT_ID, slashCommands);
  roleHandler.checkAllMembersEpsilon(client);
});

client.on('guildMemberAdd', (member) => roleHandler.handleGuildMemberAdd(member));
client.on('presenceUpdate', (oldPresence, newPresence) => roleHandler.handlePresenceUpdate(oldPresence, newPresence));
client.on('voiceStateUpdate', (oldState, newState) => voiceHandler.handleVoiceStateUpdate(oldState, newState));

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (!message.guild) return logHandler.handlePrivateMessage(client, message);
  await spamHandler.handleSpam(client, message);

  if (!message.content.startsWith(PREFIX)) return;
  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases?.includes(commandName));
  
  if (commandName === 'ticket' && args[0] === 'close') {
    try {
      await ticketHandler.closeTicket(message.channel);
    } catch (error) {
      message.reply(error.message);
    }
    return;
  }

  if (command) {
    try {
      const result = command.execute(client, message, args);
      if (result instanceof Promise) {
        await result.catch((error) => {
          console.error(`Erreur lors de l'exécution de ${commandName} :`, error);
          message.reply('Erreur lors de l’exécution de la commande.');
        });
      }
    } catch (error) {
      console.error(`Erreur synchrone lors de l'exécution de ${commandName} :`, error);
      message.reply('Erreur lors de l’exécution de la commande.');
    }
  }
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) {
    const slashCommand = client.slashCommands.get(interaction.commandName);
    if (slashCommand) {
      slashCommand.execute(interaction).catch((error) => {
        console.error(`Erreur lors de l'exécution de ${interaction.commandName} :`, error);
        interaction.reply({ content: 'Erreur lors de l’exécution de la commande.', ephemeral: true });
      });
    }
  }

  await ticketHandler.handleTicketCreation(interaction);
});

// Lancer le bot
client.login(TOKEN);