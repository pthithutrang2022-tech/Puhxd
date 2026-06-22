const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.DirectMessages,
  ],
});

// Collections
client.commands = new Collection();
client.slashCommands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();
client.cooldowns = new Collection();
client.filters = new Collection();

// Load commands
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
  const folderPath = path.join(commandsPath, folder);
  const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
  
  for (const file of commandFiles) {
    const filePath = path.join(folderPath, file);
    const command = require(filePath);
    
    if (command.data) {
      client.slashCommands.set(command.data.name, command);
    } else if (command.name) {
      client.commands.set(command.name, command);
    }
  }
}

// Load filters
const filtersPath = path.join(__dirname, 'filters');
if (fs.existsSync(filtersPath)) {
  const filterFiles = fs.readdirSync(filtersPath).filter(file => file.endsWith('.js'));
  
  for (const file of filterFiles) {
    const filePath = path.join(filtersPath, file);
    const filter = require(filePath);
    client.filters.set(filter.name, filter);
  }
}

// Load event handlers
const eventsPath = path.join(__dirname, 'events');
const eventFolders = fs.readdirSync(eventsPath);

for (const folder of eventFolders) {
  const folderPath = path.join(eventsPath, folder);
  const eventFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
  
  for (const file of eventFiles) {
    const filePath = path.join(folderPath, file);
    const event = require(filePath);
    
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }
}

// Error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

client.login(process.env.DISCORD_TOKEN);
