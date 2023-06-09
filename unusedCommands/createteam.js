const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, Message } = require("discord.js");
const { MongoClient } = require("mongodb");
const { registerUserIfNotRegistered } = require("../functions/registerUserIfNotRegistered");
const { registerTeamIfNotRegistered } = require("../functions/registerTeamIfNotRegistered");

const serverUri = process.env["SERVERURI"]

const dbClient = new MongoClient(serverUri);
const dbDareClient = new MongoClient(serverUri);
module.exports = {
	data: new SlashCommandBuilder()
		.setName("createteam")
		.setDescription("Create a team of players and gain access to private channels.")
        .addStringOption(option => option.setName("teamname").setDescription("Team Name").setRequired(true)),
	async execute(interaction) {
        registerUserIfNotRegistered(interaction.user);
        const teamName = interaction.options.getString("teamname");
        registerTeamIfNotRegistered(interaction, teamName);
	}
};