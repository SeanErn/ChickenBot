const {Client, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply({content: `Pong! (${interaction.client.ws.ping}ms)`, ephemeral: true});
	},
};
 