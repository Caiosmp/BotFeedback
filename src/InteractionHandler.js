const EmbedManager = require('./EmbedManager');

class InteractionHandler {
    constructor(client) {
        this.client = client;
        this.embedManager = new EmbedManager();  // Instancia o EmbedManager para gerenciar embeds
    }

    async handleInteraction(interaction) {
        if (interaction.isChatInputCommand()) {
            // Tratar comandos de barra (slash commands)
            const command = this.client.commands.get(interaction.commandName);
            if (!command) {
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error('Erro ao executar comando:', error);
                await interaction.reply({ content: 'Ocorreu um erro ao executar esse comando.', ephemeral: true });
            }
        } else if (interaction.isButton()) {
            // Tratar interações com botões
            try {
                const customId = interaction.customId;

                if (customId === 'avaliar') {
                    // Botão "avaliar" relacionado ao setar_embed
                    const command = this.client.commands.get('setar_embed');
                    if (command && command.handleButton) {
                        await command.handleButton(interaction);
                    }
                } else if (customId === 'edit_bannerfeed') {
                    // Botão para editar o banner do feed
                    const command = this.client.commands.get('bannerfeed');
                    if (command && command.handleButton) {
                        await command.handleButton(interaction);
                    }
                } else if (customId.startsWith('edit_')) {
                    // Verificar se é um botão relacionado ao configfeed
                    const configCommand = this.client.commands.get('configfeed');
                    if (configCommand && configCommand.handleButton && (customId.includes('bot_name') || customId.includes('bot_image') || customId.includes('feedback_channel') || customId.includes('client_role') || customId.includes('staff_role'))) {
                        await configCommand.handleButton(interaction);
                    } else {
                        // Caso contrário, delega para o EmbedManager (personalizar_embed)
                        await this.embedManager.handleButton(interaction);
                    }
                } else {
                    await interaction.reply({ content: 'Ocorreu um erro ao processar sua ação.', ephemeral: true });
                }
            } catch (error) {
                console.error('Erro ao processar a interação de botão:', error);
                await interaction.reply({ content: 'Ocorreu um erro ao processar sua ação.', ephemeral: true });
            }
        } else if (interaction.isModalSubmit()) {
            // Tratar o envio de modais
            try {
                const customId = interaction.customId;

                if (customId === 'modal_avaliacao') {
                    // Modal de avaliação relacionado ao setar_embed
                    const command = this.client.commands.get('setar_embed');
                    if (command && command.handleModalSubmit) {
                        await command.handleModalSubmit(interaction);
                    }
                } else if (customId === 'modal_bannerfeed') {
                    // Modal para editar o banner do feed
                    const command = this.client.commands.get('bannerfeed');
                    if (command && command.handleModalSubmit) {
                        await command.handleModalSubmit(interaction);
                    }
                } else {
                    // Verificar se é um modal relacionado ao configfeed
                    const configCommand = this.client.commands.get('configfeed');
                    if (configCommand && configCommand.handleModalSubmit && (customId.includes('modal_bot_name') || customId.includes('bot_image') || customId.includes('feedback_channel') || customId.includes('client_role') || customId.includes('staff_role'))) {
                        await configCommand.handleModalSubmit(interaction);
                    } else {
                        // Caso contrário, delega para o EmbedManager (personalizar_embed)
                        await this.embedManager.handleModalSubmit(interaction);
                    }
                }
            } catch (error) {
                console.error('Erro ao processar o envio do modal:', error);
                await interaction.reply({ content: 'Ocorreu um erro ao processar sua ação.', ephemeral: true });
            }
        }
    }
}

module.exports = InteractionHandler;
