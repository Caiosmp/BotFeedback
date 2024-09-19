const { SlashCommandBuilder } = require('@discordjs/builders');
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');
const EmbedManager = require('../src/EmbedManager');
const configPath = path.join(__dirname, '../config/config.json');
let config = require(configPath);

const embedManager = new EmbedManager();

function saveConfig(updatedConfig) {
    fs.writeFileSync(configPath, JSON.stringify(updatedConfig, null, 2));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('personalizar_embed')
        .setDescription('Personaliza a embed com várias opções de conteúdo e layout.'),

    async execute(interaction) {
        const row1 = this.createButtonRow([
            { customId: 'edit_banner', label: '🖼️ Banner' },
            { customId: 'edit_thumbnail', label: '🖼️ Mini Foto' },
            { customId: 'edit_title', label: '📝 Título' }
        ]);

        const row2 = this.createButtonRow([
            { customId: 'edit_description', label: '📝 Descrição' },
            { customId: 'edit_color', label: '🎨 Cor' },
            { customId: 'update_embed', label: '🔄 Atualizar Embed' }, // Adicionando o botão de atualizar
            { customId: 'edit_banner_feed', label: '🖼️ Banner Feed' }  // Novo botão Banner Feed
        ]);

        await interaction.reply({ content: 'Escolha uma opção para personalizar a embed.', components: [row1, row2], ephemeral: false });
    },

    createButtonRow(buttons) {
        const row = new ActionRowBuilder();
        buttons.forEach(button => {
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(button.customId)
                    .setLabel(button.label)
                    .setStyle(ButtonStyle.Primary)
            );
        });
        return row;
    },

    async handleButton(interaction) {
        const { customId } = interaction;

        // Lógica para atualizar a embed
        if (customId === 'update_embed') {
            // Atualiza a embed sem precisar do comando /lancar_embed
            await interaction.update({ embeds: [global.currentEmbed] });
            await interaction.followUp({ content: 'Embed atualizada com sucesso!', ephemeral: false });
        }

        // Lógica para editar cada campo da embed
        const modals = {
            'edit_banner': this.createModal('modal_banner', 'Editar Banner', 'banner_input', 'Nova URL do Banner'),
            'edit_thumbnail': this.createModal('modal_thumbnail', 'Editar Mini Foto', 'thumbnail_input', 'Nova URL da Mini Foto'),
            'edit_title': this.createModal('modal_title', 'Editar Título', 'title_input', 'Novo Título'),
            'edit_description': this.createModal('modal_description', 'Editar Descrição', 'description_input', 'Nova Descrição'),
            'edit_color': this.createModal('modal_color', 'Editar Cor', 'color_input', 'Nova Cor (Hexadecimal)'),
            'edit_banner_feed': this.createModal('modal_banner_feed', 'Editar Banner Feed', 'banner_feed_input', 'Nova URL do Banner Feed')  // Novo modal para Banner Feed
        };

        if (modals[customId]) {
            await interaction.showModal(modals[customId]);
        }
    },

    createModal(customId, title, inputId, label) {
        return new ModalBuilder()
            .setCustomId(customId)
            .setTitle(title)
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId(inputId)
                        .setLabel(label)
                        .setStyle(TextInputStyle.Short)
                )
            );
    },

    async handleModalSubmit(interaction) {
        const { customId } = interaction;

        switch (customId) {
            case 'modal_banner':
            case 'modal_thumbnail':
                const url = interaction.fields.getTextInputValue(`${customId.split('_')[1]}_input`);
                if (this.isValidUrl(url)) {
                    customId === 'modal_banner' ? global.currentEmbed.setImage(url) : global.currentEmbed.setThumbnail(url);
                    embedManager.saveEmbed();
                    await interaction.reply({ content: 'URL atualizada com sucesso!', ephemeral: false });
                } else {
                    await interaction.reply({ content: 'URL inválida! Tente novamente.', ephemeral: false });
                }
                break;

            case 'modal_title':
                const title = interaction.fields.getTextInputValue('title_input');
                global.currentEmbed.setTitle(title);
                embedManager.saveEmbed();
                await interaction.reply({ content: 'Título atualizado!', ephemeral: false });
                break;

            case 'modal_description':
                const description = interaction.fields.getTextInputValue('description_input');
                global.currentEmbed.setDescription(description);
                embedManager.saveEmbed();
                await interaction.reply({ content: 'Descrição atualizada!', ephemeral: false });
                break;

            case 'modal_color':
                const color = interaction.fields.getTextInputValue('color_input');
                global.currentEmbed.setColor(color);
                config.embedColor = color;  
                saveConfig(config);  
                embedManager.saveEmbed();
                await interaction.reply({ content: 'Cor atualizada!', ephemeral: false });
                break;

            case 'modal_banner_feed':
                const bannerFeedUrl = interaction.fields.getTextInputValue('banner_feed_input');
                if (this.isValidUrl(bannerFeedUrl)) {
                    global.feedEmbed.setImage(bannerFeedUrl);
                    embedManager.saveFeedEmbed();
                    await interaction.reply({ content: 'URL do Banner Feed atualizada com sucesso!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'URL do Banner Feed inválida! Tente novamente.', ephemeral: true });
                }
                break;
        }
    },

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
};
