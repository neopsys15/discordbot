const { EmbedBuilder } = require('discord.js');

const categories = {
  general: 9,
  science: 17,
  history: 23,
  movies: 11
};

module.exports = {
  name: 'trivia',
  aliases: ['quiz', 'triv'],
  description: 'Lance un jeu de trivia avec une question aléatoire en français depuis Internet. Choisis une catégorie si tu veux !',
  usage: '.trivia [categorie] (ex: .trivia science, .trivia history, .trivia movies)',
  async execute(client, message, args) {
    const isMessage = message.reply && !message.commandName;
    const channel = isMessage ? message.channel : message.channel;

    const category = args[0]?.toLowerCase() || 'general';
    const categoryId = categories[category] || 9;

    try {
      const url = `https://opentdb.com/api.php?amount=1&type=multiple&category=${categoryId}`;
      console.log(`Requête API : ${url}`);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Erreur API : ${response.status} - ${response.statusText}`);
      const data = await response.json();
      if (!data.results || data.results.length === 0) throw new Error('Aucune question reçue de l’API');

      const trivia = data.results[0];
      const translateToFrench = async (text) => {
        const translateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fr&dt=t&q=${encodeURIComponent(text)}`;
        const translateResponse = await fetch(translateUrl);
        const translateData = await translateResponse.json();
        return translateData[0][0][0];
      };

      const decodeHTML = (str) => str.replace(/"/g, '"').replace(/'/g, "'").replace(/&/g, '&');
      const questionEn = decodeHTML(trivia.question);
      const correctAnswerEn = decodeHTML(trivia.correct_answer);
      const incorrectAnswersEn = trivia.incorrect_answers.map(decodeHTML);

      const question = await translateToFrench(questionEn);
      const correctAnswer = await translateToFrench(correctAnswerEn);
      const incorrectAnswers = await Promise.all(incorrectAnswersEn.map(translateToFrench));

      const options = [...incorrectAnswers, correctAnswer];
      const shuffledOptions = options.sort(() => Math.random() - 0.5);
      const correctIndex = shuffledOptions.indexOf(correctAnswer);
      console.log(`Options : ${shuffledOptions.join(', ')}`);
      console.log(`Bonne réponse : ${correctAnswer}, Index : ${correctIndex}`);

      const embed = new EmbedBuilder()
        .setTitle(`🎲 Temps de Trivia - ${category.charAt(0).toUpperCase() + category.slice(1)} !`)
        .setDescription(`${question}\n\n${shuffledOptions.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n')}\n\nRéagissez avec A, B, C ou D dans les 30 secondes !`)
        .setColor('#FF4500');

      const sentMessage = await channel.send({ embeds: [embed] });
      const reactions = ['🇦', '🇧', '🇨', '🇩'];
      for (let i = 0; i < reactions.length; i++) await sentMessage.react(reactions[i]);

      const filter = (reaction, user) => {
        const isValid = reactions.includes(reaction.emoji.name) && !user.bot;
        console.log(`Réaction détectée : ${reaction.emoji.name} par ${user.tag}, Valide : ${isValid}`);
        return isValid;
      };
      const collector = sentMessage.createReactionCollector({ filter, time: 30000 });

      collector.on('collect', (reaction, user) => {
        console.log(`Réaction collectée en temps réel : ${reaction.emoji.name} par ${user.tag}`);
      });

      collector.on('end', async collected => {
        const correctReaction = reactions[correctIndex];
        console.log(`Réaction correcte attendue : ${correctReaction}`);
        console.log(`Réactions collectées : ${[...collected.keys()].join(', ')}`);
        const reaction = collected.get(correctReaction);
        const winners = reaction ? reaction.users.cache.filter(u => !u.bot) : new Map();
        console.log(`Gagnants : ${winners.size > 0 ? [...winners.keys()].join(', ') : 'Aucun'}`);

        const resultEmbed = new EmbedBuilder()
          .setTitle('Trivia terminé !')
          .setDescription(`La bonne réponse était : **${correctAnswer}**\n\n${winners.size > 0 ? `Gagnants : ${winners.map(u => u.tag).join(', ')}` : 'Personne n’a trouvé !'}`)
          .setColor('#00FF00');

        await channel.send({ embeds: [resultEmbed] });
      });
    } catch (error) {
      console.error(`Erreur dans trivia : ${error.message}`);
      if (isMessage) {
        await message.reply(`Désolé, je n’ai pas pu récupérer ou traduire une question : ${error.message}. Réessaie plus tard !`);
      } else {
        await message.reply({ content: `Désolé, je n’ai pas pu récupérer ou traduire une question : ${error.message}. Réessaie plus tard !`, ephemeral: true });
      }
    }
  }
};