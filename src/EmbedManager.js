const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const fs = require('fs');
const config = require('../config/config.json'); // Carrega diretamente o config.json

class EmbedManager {
    constructor() {
        this.loadEmbed();
        this.loadFeedEmbed(); // Carrega o Banner Feed separado
    }

    // Carregar a embed salva ou criar uma nova padrão
    loadEmbed() {
        // Verifica se já existe uma embed carregada para evitar duplicações
        if (!global.currentEmbed) {
            global.currentEmbed = new EmbedBuilder()
                .setTitle(config.embedTitle || '📝 Embed Padrão')
                .setColor(config.embedColor || '#00FF00') // Usa a cor do config ou a padrão
                .setImage(config.BannerNormal || '')
                .setThumbnail(config.botImage || '')
                .setDescription(config.embedDescription || 'Personalize antes de enviá-la!');
        }
    }

    // Carregar o banner feed salvo ou criar um novo padrão
    loadFeedEmbed() {
        if (!global.feedEmbed) {
            global.feedEmbed = new EmbedBuilder()
                .setTitle('FEEDBACKS')
                .setDescription('DE O SEU FEED')
                .setColor(config.embedColor || '#00FF00') // Usa a mesma cor do embed principal
                .setImage(config.BannerFeed || '');
        }
    }

    // Salvar a embed atual no config.json
    saveEmbed() {
        // Atualiza apenas as propriedades relevantes no config.json
        config.BannerNormal = global.currentEmbed.data.image?.url || '';
        config.botImage = global.currentEmbed.data.thumbnail?.url || '';
        config.embedColor = global.currentEmbed.data.color || '#00FF00';
        config.embedTitle = global.currentEmbed.data.title || '📝 Embed Padrão';
        config.embedDescription = global.currentEmbed.data.description || 'Personalize antes de enviá-la!';

        // Salva as mudanças no arquivo config.json
        fs.writeFileSync('./config/config.json', JSON.stringify(config, null, 2));
    }

    // Salvar o banner feed atual no config.json
    saveFeedEmbed() {
        config.BannerFeed = global.feedEmbed.data.image?.url || '';
        fs.writeFileSync('./config/config.json', JSON.stringify(config, null, 2));
    }

    // Gerenciar botões clicados
    async handleButton(interaction) {
        const customId = interaction.customId;
        console.log(`Botão clicado: ${customId}`); // Log para depuração

        const modals = {
            'edit_banner': this.createModal('modal_banner', 'Editar Banner', 'banner_input', 'Nova URL do Banner'),
            'edit_banner_feed': this.createModal('modal_banner_feed', 'Editar Banner Feed', 'banner_feed_input', 'Nova URL do Banner Feed'), // Adicionando modal para Banner Feed
            'edit_thumbnail': this.createModal('modal_thumbnail', 'Editar Mini Foto', 'thumbnail_input', 'Nova URL da Mini Foto'),
            'edit_title': this.createModal('modal_title', 'Editar Título', 'title_input', 'Novo Título'),
            'edit_description': this.createModal('modal_description', 'Editar Descrição', 'description_input', 'Nova Descrição'),
            'edit_color': this.createModal('modal_color', 'Editar Cor', 'color_input', 'Nova Cor (Hexadecimal)')
        };

        if (modals[customId]) {
            await interaction.showModal(modals[customId]);
        } else if (customId === 'update_embed') {
            // Atualizar a embed sem reexecutar o comando
            await interaction.update({ embeds: [global.currentEmbed] });
        } else {
            await interaction.reply({ content: 'Comando não reconhecido.', ephemeral: true });
        }
    }

    // Criar modal para cada campo editável
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
                        .setRequired(true)
                )
            );
    }

    // Processar o envio dos modais
    async handleModalSubmit(interaction) {
        const customId = interaction.customId;
        console.log(`Modal enviado: ${customId}`); // Log para depuração

        switch (customId) {
            case 'modal_banner':
                const bannerUrl = interaction.fields.getTextInputValue('banner_input');
                if (this.isValidUrl(bannerUrl)) {
                    global.currentEmbed.setImage(bannerUrl);
                    this.saveEmbed();
                    await interaction.reply({ content: 'URL do Banner atualizada com sucesso!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'URL inválida! Tente novamente.', ephemeral: true });
                }
                break;

            case 'modal_banner_feed':
                const bannerFeedUrl = interaction.fields.getTextInputValue('banner_feed_input');
                if (this.isValidUrl(bannerFeedUrl)) {
                    global.feedEmbed.setImage(bannerFeedUrl);
                    this.saveFeedEmbed();
                    await interaction.reply({ content: 'URL do Banner Feed atualizada com sucesso!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'URL inválida! Tente novamente.', ephemeral: true });
                }
                break;

            case 'modal_thumbnail':
                const thumbnailUrl = interaction.fields.getTextInputValue('thumbnail_input');
                if (this.isValidUrl(thumbnailUrl)) {
                    global.currentEmbed.setThumbnail(thumbnailUrl);
                    this.saveEmbed();
                    await interaction.reply({ content: 'URL da Mini Foto atualizada com sucesso!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'URL inválida! Tente novamente.', ephemeral: true });
                }
                break;

            case 'modal_title':
                const title = interaction.fields.getTextInputValue('title_input');
                global.currentEmbed.setTitle(title);
                this.saveEmbed();
                await interaction.reply({ content: 'Título atualizado!', ephemeral: true });
                break;

            case 'modal_description':
                const description = interaction.fields.getTextInputValue('description_input');
                global.currentEmbed.setDescription(description);
                this.saveEmbed();
                await interaction.reply({ content: 'Descrição atualizada!', ephemeral: true });
                break;

            case 'modal_color':
                const color = interaction.fields.getTextInputValue('color_input');
                global.currentEmbed.setColor(color);
                config.embedColor = color; // Salva a nova cor no config
                this.saveEmbed(); // Salva a cor e outras propriedades
                await interaction.reply({ content: 'Cor atualizada!', ephemeral: true });
                break;

            default:
                await interaction.reply({ content: 'Modal não reconhecido.', ephemeral: true });
                break;
        }
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
}

module.exports = EmbedManager;
