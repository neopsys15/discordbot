const { PermissionFlagsBits } = require('discord.js');

const privateVoiceChannels = new Map();

module.exports = {
  handleVoiceStateUpdate: async (oldState, newState) => {
    const guild = newState.guild;
    const user = newState.member;
    const createChannelId = '1343920789430468639';
    const categoryId = '1343919308098506845';

    if (newState.channelId === createChannelId) {
      const newChannel = await guild.channels.create({
        name: `Salon de ${user.user.username}`,
        type: 2,
        parent: categoryId,
        permissionOverwrites: [
          { id: guild.id, deny: [PermissionFlagsBits.Connect] },
          { id: user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect, PermissionFlagsBits.Speak, PermissionFlagsBits.ManageChannels] },
        ],
      });
      await newState.setChannel(newChannel);
      privateVoiceChannels.set(user.id, newChannel.id);
    }

    if (oldState.channelId && oldState.channelId !== newState.channelId) {
      privateVoiceChannels.forEach(async (channelId, creatorId) => {
        const privateChannel = guild.channels.cache.get(channelId);
        if (privateChannel && privateChannel.members.size === 0) {
          await privateChannel.delete().catch(console.error);
          privateVoiceChannels.delete(creatorId);
        }
      });
    }
  },
};