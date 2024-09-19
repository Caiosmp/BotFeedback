//deploy.js


const { REST, Routes } = require('discord.js');
const config = require('../config/config.json');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, 'Comandos');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
    try {
        console.log('⏳ Atualizando os comandos de aplicação (/) no Discord...');

        await rest.put(
            Routes.applicationCommands(config.clientId),
            { body: commands }
        );

        console.log('✅ Comandos de aplicação (/) foram atualizados com sucesso.');
    } catch (error) {
        console.error('❌ Erro ao atualizar os comandos de aplicação:', error);
    }
})();
