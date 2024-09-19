//Botclient.js

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const CommandHandler = require('./CommandHandler');
const InteractionHandler = require('./InteractionHandler');

class BotClient extends Client {
    constructor(config) {
        super({ intents: [GatewayIntentBits.Guilds] });
        this.commands = new Collection();
        this.config = config;

        this.commandHandler = new CommandHandler(this);
        this.interactionHandler = new InteractionHandler(this);

        this.on('ready', this.onReady.bind(this));
        this.on('interactionCreate', this.interactionHandler.handleInteraction.bind(this.interactionHandler));
    }

    onReady() {
        console.log(`🔥 Estou online em ${this.user.tag}!`);
    }

    start() {
        this.commandHandler.loadCommands();
        this.login(this.config.token);
    }
}

module.exports = BotClient;
