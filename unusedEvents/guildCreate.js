const {Events, ChannelType, EmbedBuilder } = require('discord.js');
module.exports = {
	name: Events.GuildCreate,
	once: true,
	execute(guild) {
        guild.channels.create({
            name: "🚀-chickenbot-commands",
            type: ChannelType.GuildText
        });
        guild.channels.create({
            name: "🙏🏽-team-select",
            type: ChannelType.GuildText
        });
	},
};