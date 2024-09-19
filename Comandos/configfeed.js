const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');
const configPath = path.resolve(__dirname, '../config/config.json');
let config = require(configPath);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('configfeed')
        .setDescription('Configura as opções globais do bot para feedback e avaliação.'),

    async execute(interaction) {
        const row1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('edit_bot_name')
                    .setLabel('📝 Nome do Bot')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('edit_bot_image')
                    .setLabel('🖼️ Imagem do Bot')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('edit_feedback_channel')
                    .setLabel('📢 Canal de Feedbacks')
                    .setStyle(ButtonStyle.Primary)
            );

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('edit_client_role')
                    .setLabel('👥 Cargo de Cliente')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('edit_staff_role')
                    .setLabel('👤 Cargo de Staff')
                    .setStyle(ButtonStyle.Primary)
            );

        try {
            await interaction.reply({ content: 'Escolha uma opção para configurar:', components: [row1, row2], ephemeral: false });
        } catch (error) {
            console.error('Erro ao exibir os botões:', error);
            await interaction.reply({ content: 'Erro ao exibir os botões de configuração.', ephemeral: true });
        }
    },

    async handleButton(interaction) {
        const { customId } = interaction;

        try {
            let modal;
            if (customId === 'edit_bot_name') {
                modal = new ModalBuilder()
                    .setCustomId('modal_bot_name')
                    .setTitle('Editar Nome do Bot');

                modal.addComponents(
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('name_input')
                            .setLabel('Novo Nome do Bot')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    )
                );
            } else if (customId === 'edit_bot_image') {
                modal = new ModalBuilder()
                    .setCustomId('modal_bot_image')
                    .setTitle('Editar Imagem do Bot');

                modal.addComponents(
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('image_input')
                            .setLabel('Nova URL da Imagem do Bot')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    )
                );
            } else if (customId === 'edit_feedback_channel') {
                modal = new ModalBuilder()
                    .setCustomId('modal_feedback_channel')
                    .setTitle('Editar Canal de Feedbacks');

                modal.addComponents(
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('channel_input')
                            .setLabel('ID do Canal de Feedbacks')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    )
                );
            } else if (customId === 'edit_client_role') {
                modal = new ModalBuilder()
                    .setCustomId('modal_client_role')
                    .setTitle('Editar Cargo de Cliente');

                modal.addComponents(
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('role_input')
                            .setLabel('ID do Cargo de Cliente')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    )
                );
            } else if (customId === 'edit_staff_role') {
                modal = new ModalBuilder()
                    .setCustomId('modal_staff_role')
                    .setTitle('Editar Cargo de Staff');

                modal.addComponents(
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('role_input')
                            .setLabel('ID do Cargo de Staff')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    )
                );
            }

            if (modal) {
                await interaction.showModal(modal);
            } else {
                await interaction.reply({ content: 'Ação desconhecida.', ephemeral: true });
            }
        } catch (error) {
            console.error('Erro ao processar o botão:', error);
            await interaction.reply({ content: 'Erro ao processar sua ação.', ephemeral: true });
        }
    },

    async handleModalSubmit(interaction) {
        const { customId } = interaction;

        try {
            if (customId === 'modal_bot_name') {
                const newName = interaction.fields.getTextInputValue('name_input');
                config.botName = newName;

                // Atualiza o nome do bot programaticamente
                await interaction.client.user.setUsername(newName);

            } else if (customId === 'modal_bot_image') {
                const newImage = interaction.fields.getTextInputValue('image_input');
                config.botImage = newImage;

                // Atualiza a imagem do bot programaticamente
                await interaction.client.user.setAvatar(newImage);

            } else if (customId === 'modal_feedback_channel') {
                const newChannelId = interaction.fields.getTextInputValue('channel_input');
                config.feedbackChannelId = newChannelId;

            } else if (customId === 'modal_client_role') {
                const newRoleId = interaction.fields.getTextInputValue('role_input');
                config.clientRoleId = newRoleId;

            } else if (customId === 'modal_staff_role') {
                const newRoleId = interaction.fields.getTextInputValue('role_input');
                config.staffRoleId = newRoleId;
            }

            // Salva as alterações no arquivo config.json
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            await interaction.reply({ content: 'Configuração atualizada com sucesso!', ephemeral: true });

        } catch (error) {
            console.error('Erro ao processar o modal:', error);
            await interaction.reply({ content: 'Erro ao processar a submissão.', ephemeral: true });
        }
    }
};
