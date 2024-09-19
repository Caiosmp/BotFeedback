//CommandHandler.js

const fs = require('fs');
const path = require('path');

class CommandHandler {
    constructor(client) {
        this.client = client;
    }

    loadCommands() {
        const commandsPath = path.join(__dirname, '../Comandos');
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(path.join(commandsPath, file));
            if (command.data && command.data.name) {
                this.client.commands.set(command.data.name, command);
            } else {
                console.error(`O comando no arquivo ${file} está faltando a propriedade 'data' ou 'name'.`);
            }
        }
    }

    async deployCommands() {
        const { REST, Routes } = require('discord.js');
        const commands = this.client.commands.map(command => command.data.toJSON());
        const rest = new REST({ version: '10' }).setToken(this.client.config.token);

        try {
            console.log('⏳ Atualizando os comandos de aplicação (/) no Discord...');

            await rest.put(
                Routes.applicationCommands(this.client.config.clientId),
                { body: commands }
            );

            console.log('✅ Comandos de aplicação (/) foram atualizados com sucesso.');
        } catch (error) {
            console.error('❌ Erro ao atualizar os comandos de aplicação:', error);
        }
    }
}

module.exports = CommandHandler;
