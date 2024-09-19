# 🤖 **Bot de Feedback - Avalie com Estilo no Discord**

<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/c/cb/WhatsApp-BOT-Image-2_2.gif" alt="Bot funcionando" width="700">
</p>

<p align="center">
  <a href="https://discord.js.org"><img src="https://img.shields.io/badge/Discord.js-14.0-blue.svg?logo=discord&logoColor=white" alt="Discord.js"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js->=16.6-green.svg?logo=node.js" alt="Node.js"></a>
  <a href="https://github.com/Caiosmp/BotFeedback/issues"><img src="https://img.shields.io/github/issues/Caiosmp/BotFeedback" alt="Issues"></a>
  <a href="https://github.com/Caiosmp/BotFeedback/blob/main/LICENSE"><img src="https://img.shields.io/github/license/Caiosmp/BotFeedback" alt="Licença"></a>
  <a href="#"><img src="https://img.shields.io/badge/Versão-1.0.0-orange.svg"></a>
</p>

## ✨ **Introdução**

**Bot de Feedback** é a solução perfeita para quem quer coletar feedback de maneira prática, rápida e personalizável diretamente no Discord! Seja para eventos, serviços ou interações, seus membros podem opinar com um simples clique, e você ainda pode personalizar a aparência do bot para se adequar ao estilo do seu servidor.

---

## ⚡ **Funcionalidades Principais**

✔️ **Feedback Instantâneo**: Crie e envie enquetes e pedidos de feedback com um clique.  
✔️ **Totalmente Personalizável**: Ajuste nome, imagem, canais e até cores de embed usando o comando `/configfeed`.  
✔️ **Permissões de Cargos**: Atribua permissões diferentes para clientes e staff.  
✔️ **Feedback Rápido e Direto**: Cada avaliação leva menos de um minuto.  

---

## 🎬 **Demonstração Visual**

<p align="center">
  <img src="https://s11.gifyu.com/images/SAwrA.gif" alt="Demonstração de como funciona o bot" width="700">
</p>

---

## 📦 **Guia de Instalação**

Siga esses passos para configurar o bot no seu servidor Discord:

1. **Baixe o ZIP do codigo e descompacte**
   ```bash
   https://github.com/Caiosmp/BotFeedback.git
2. **Instale as dependências**
   ```bash
   npm i

## 🛠️ **Comandos Disponíveis**

| Comando            | Descrição                                            |
|--------------------|------------------------------------------------------|
| `/configfeed`      | Configura as opções globais do bot, como canal e cargos. |
| `/setar_embed`          | Lança uma embed solicitando feedback dos usuários.    |
| `/PersonalizarEmbed`| Personaliza as cores, banners e imagens das mensagens de feedback. |
| `/ping`            | Teste de latência (ainda precisa de correções).       |

## 🎨 **Personalização Avançada**

Com o comando `/configfeed`, você pode personalizar o **nome**, **imagem**, e até **cores** e **banners** das mensagens de feedback. Ideal para adaptar o bot ao tema do seu servidor!

- **Nome e Imagem**: Customize o nome e a imagem de perfil do bot.
- **Cores e Banners**: Defina as cores dos embeds e banners que vão aparecer no canal de feedback.

---

## 🔧 **Configuração Manual (config.json)**

Antes de iniciar o bot pela primeira vez, é **necessário** configurar o arquivo `config.json` com informações importantes, como o token do bot e IDs de cargos e canais:

```json
{
  "token": "seu-discord-token-aqui",
  "embedColor": 25343,
  "feedbackChannelId": "ID_do_canal_aqui",
  "clientRoleId": "ID_do_cargo_cliente_aqui",
  "staffRoleId": "ID_do_cargo_staff_aqui",
  "botImage": "https://link-da-imagem.png",
  "embedTitle": "Avalie nosso serviço!",
  "botName": "FeedbackBot",
  "BannerNormal": "https://link-do-banner.png",
  "BannerFeed": "https://link-do-banner-feedback.png",
  "embedDescription": "Clique no botão para nos avaliar, não vai levar nem 1 minuto!"
}


