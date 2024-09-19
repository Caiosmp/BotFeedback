//index.js

const BotClient = require('./src/BotClient');
const config = require('./config/config.json');

const client = new BotClient(config);
client.start();