module.exports = {
    checkRaid: (message) => {
      // Vérification pour détecter des raids dans les messages
      if (message.content.toLowerCase().includes("invite")) {
        message.delete();
        message.author.send("❌ Les invitations externes sont interdites ici.");
      }
    }
  };
  