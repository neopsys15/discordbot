module.exports = {
    handleGuildMemberAdd: async (member) => {
      const welcomeChannel = member.guild.channels.cache.get('1342896153863258155');
      if (welcomeChannel) {
        welcomeChannel.send(`Bienvenue à ${member} sur Epsilon 🌟\n<:epsilon3:1343728371070275585> Grâce à lui/elle nous sommes désormais ${member.guild.memberCount} ! <:wave:1343742257752440916>\n<:epsilon3:1343728371070275585> /epsilon en statut pour avoir la perm gif & image ! <a:pop_corn:1343742357031354378>`);
      }
      module.exports.checkEpsilonStatus(member);
    },
  
    handlePresenceUpdate: async (oldPresence, newPresence) => {
      if (!newPresence?.activities) return;
      const epsilonRole = newPresence.guild.roles.cache.get('1343619803415445504');
      if (!epsilonRole) return;
  
      if (newPresence.activities.some(activity => activity.type === 4 && activity.state?.includes('/epsilon'))) {
        if (!newPresence.member.roles.cache.has(epsilonRole.id)) {
          await newPresence.member.roles.add(epsilonRole);
          console.log(`Le rôle Epsilon a été attribué à ${newPresence.member.user.tag}`);
        }
      } else if (newPresence.member.roles.cache.has(epsilonRole.id)) {
        await newPresence.member.roles.remove(epsilonRole);
        console.log(`Le rôle Epsilon a été retiré de ${newPresence.member.user.tag}`);
      }
    },
  
    checkEpsilonStatus: async (member) => {
      const epsilonRole = member.guild.roles.cache.get('1343619803415445504');
      if (epsilonRole && member.presence?.activities.some(activity => activity.name === 'Discord' && activity.state?.includes('/epsilon'))) {
        await member.roles.add(epsilonRole);
        console.log(`Le rôle Epsilon a été attribué à ${member.user.tag}`);
      }
    },
  
    checkAllMembersEpsilon: (client) => {
      client.guilds.cache.forEach(guild => {
        guild.members.cache.forEach(member => module.exports.checkEpsilonStatus(member));
      });
    },
  };