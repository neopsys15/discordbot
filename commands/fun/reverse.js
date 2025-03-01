module.exports = {
  name: 'reverse',
  description: 'Inverse un texte',
  aliases: [], 
  type: 'fun',
  usage: '.reverse {text}',
  async execute(client, message, args) {
      if (!args.length) {
        return message.channel.send("❌ Donne-moi un texte à inverser !");
      }
      const reversed = args.join(' ').split('').reverse().join('');
      message.channel.send(`🔄 ${reversed}`);
    }
  };
  




