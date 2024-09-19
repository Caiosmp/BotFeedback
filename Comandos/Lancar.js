    //Lancar.js

    const { SlashCommandBuilder } = require('@discordjs/builders');
    const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
    const config = require('../config/config.json');

    module.exports = {
        data: new SlashCommandBuilder()
            .setName('setar_embed')
            .setDescription('Configura a embed de avaliação no canal.'),

        async execute(interaction) {
            // Verifica se já existe uma embed personalizada global, caso contrário, envia uma mensagem
            if (!global.currentEmbed) {
                return interaction.reply({ content: 'Nenhuma embed foi personalizada. Use /personalizar_embed primeiro.', ephemeral: true });
            }

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('avaliar')
                        .setLabel('📝 Deixe seu Feedback!')
                        .setStyle(ButtonStyle.Secondary)
                );

            try {
                // Usamos deferReply para atrasar a resposta
                await interaction.deferReply({ ephemeral: true });

                // Enviamos a embed e componentes no canal
                await interaction.channel.send({ embeds: [global.currentEmbed], components: [row] });

                // Depois, deletamos o reply deferido para que não seja visível ao usuário
                await interaction.deleteReply();
            } catch (error) {
                console.error('Erro ao enviar a mensagem no canal:', error);
                await interaction.followUp({ content: 'Ocorreu um erro ao configurar o canal.', ephemeral: true });
            }
        },

        async handleButton(interaction) {
            if (interaction.customId === 'avaliar') {
                try {
                    // Verifica se o usuário tem o cargo de cliente
                    const member = interaction.guild.members.cache.get(interaction.user.id);

                    if (!member.roles.cache.has(config.clientRoleId)) {
                        // Se o usuário não tiver o cargo de cliente, envia uma mensagem privada
                        return interaction.reply({ content: 'Você não é nosso cliente! Adquira agora um de nossos produtos e depois avalie-nos.', ephemeral: true });
                    }

                    // Exibe o modal de avaliação
                    const modal = new ModalBuilder()
                        .setCustomId('modal_avaliacao')
                        .setTitle('Avaliação de Produto');

                    const produtoInput = new TextInputBuilder()
                        .setCustomId('produto_input')
                        .setLabel('Produto comprado')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true);

                    const estrelasInput = new TextInputBuilder()
                        .setCustomId('estrelas_input')
                        .setLabel('Avalie o atendimento (1-5 estrelas)')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true);

                    const staffInput = new TextInputBuilder()
                        .setCustomId('staff_input')
                        .setLabel('Avaliar Staff (Opcional)')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)
                        .setPlaceholder('Cole o ID do staff aqui');

                    const descricaoInput = new TextInputBuilder()
                        .setCustomId('descricao_input')
                        .setLabel('Descrição da avaliação')
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(false);

                    modal.addComponents(
                        new ActionRowBuilder().addComponents(produtoInput),
                        new ActionRowBuilder().addComponents(estrelasInput),
                        new ActionRowBuilder().addComponents(staffInput),
                        new ActionRowBuilder().addComponents(descricaoInput)
                    );

                    await interaction.showModal(modal);
                } catch (error) {
                    console.error('Erro ao exibir o modal:', error);
                    await interaction.reply({ content: 'Erro ao tentar abrir o modal.', ephemeral: true });
                }
            }
        },

        async handleModalSubmit(interaction) {
            if (interaction.customId === 'modal_avaliacao') {
                try {
                    const produto = interaction.fields.getTextInputValue('produto_input');
                    const estrelas = interaction.fields.getTextInputValue('estrelas_input');
                    const staffId = interaction.fields.getTextInputValue('staff_input') || '';
                    const descricao = interaction.fields.getTextInputValue('descricao_input') || 'Sem descrição';
        
                    // Verificação do valor de estrelas
                    if (!/^[0-5]$/.test(estrelas)) {
                        if (/^\d+$/.test(estrelas) && (parseInt(estrelas) < 0 || parseInt(estrelas) > 5)) {
                            return interaction.reply({ content: 'Digite APENAS uma NOTA de 0 a 5, numeros menores que 0 e maiores que 5 não são aceitos.', ephemeral: true });
                        } else {
                            return interaction.reply({ content: 'Você digitou a NOTA de forma errada! Por favor, digite somente um numero de 0 a 5, este campo não aceita palavras', ephemeral: true });
                        }
                    }
        
                    const dataHora = new Date();
                    const timestamp = Math.floor(dataHora.getTime() / 1000); // Timestamp Unix
        
                    // Definindo a cor e o emoji de acordo com a quantidade de estrelas
                    let corEmbed;
                    let emojiNota;
        
                    switch (estrelas) {
                        case '0':
                            corEmbed = 'Grey';
                            emojiNota = '😐';
                            break;
                        case '1':
                        case '2':
                            corEmbed = 'Red';
                            emojiNota = '😞';
                            break;
                        case '3':
                            corEmbed = '#FFFF00'; // Código hexadecimal para amarelo
                            emojiNota = '😐';
                            break;
                        case '4':
                            corEmbed = 'Blue';
                            emojiNota = '😀';
                            break;
                        case '5':
                            corEmbed = 'Blue';
                            emojiNota = '😍';
                            break;
                        default:
                            corEmbed = 'Grey';
                            emojiNota = '🤔';
                            break;
                    }
        
                    // Verificando se o staffId foi fornecido e se pertence ao staff
                    let staff = 'Sem avaliação de Staff';
                    if (staffId) {
                        const staffMember = interaction.guild.members.cache.get(staffId);
                        if (staffMember && staffMember.roles.cache.has(config.staffRoleId)) {
                            staff = `<@${staffMember.user.id}>`; // Exibe o @ do staff
                        } else {
                            return interaction.reply({ content: 'Por favor, forneça o ID de um membro válido do staff.', ephemeral: true });
                        }
                    }
        
                    const embed = new EmbedBuilder()
                        .setTitle('❤️ | Nova Avaliação')
                        .setColor(corEmbed)
                        .setImage(config.BannerFeed || '') // Usa o banner feed se definido, caso contrário usa um padrão
                        .addFields(
                            { name: '👥 | Avaliação Enviada Por:', value: `<@${interaction.user.id}>`, inline: false },
                            { name: '🛒 | Produto Comprado:', value: produto, inline: false},
                            { name: '💼 | STAFF:', value: staff, inline: false },
                            { name: `${emojiNota} | Nota:`, value: `${'⭐'.repeat(parseInt(estrelas))} (${estrelas}/5)`, inline: false },
                            { name: '✨ | Avaliação:', value: descricao, inline: false },
                            { name: '🕒 | Data / Horário:', value: `<t:${timestamp}:F>`, inline: false }
                        )
        
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('avaliar')
                                .setLabel('📝 Avalie você também!')
                                .setStyle(ButtonStyle.Secondary)
                        );
        
                    const feedbackChannel = interaction.client.channels.cache.get(config.feedbackChannelId);
        
                    if (!feedbackChannel) {
                        throw new Error('Canal de feedback inválido.');
                    }
        
                    await feedbackChannel.send({ embeds: [embed], components: [row] });
                    await interaction.reply({ content: 'Obrigado pelo seu feedback! Sua avaliação foi enviada com sucesso.', ephemeral: true });
        
                } catch (error) {
                    console.error('Erro ao processar o envio do feedback:', error);
                    await interaction.reply({ content: 'Ocorreu um erro ao processar seu feedback. Tente novamente mais tarde.', ephemeral: true });
                }
            }
        }
    }