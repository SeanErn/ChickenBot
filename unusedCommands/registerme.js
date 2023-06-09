const { SlashCommandBuilder } = require('discord.js');
const { MongoClient } = require("mongodb");
const serverUri = process.env["SERVERURI"]

const dbClient = new MongoClient(serverUri);
module.exports = {
	data: new SlashCommandBuilder()
		.setName('registerme')
		.setDescription('A test command for registering a user to the database.'),
	async execute(interaction) {
        try {
            await dbClient.connect();
            // database and collection code goes here
            const db = dbClient.db("chickenBotUserData");
            const coll = db.collection("chickenBotUserData");

            //ensure the user is not already registered
          if (await coll.findOne({userId:interaction.user.id}) != null){
            await interaction.reply({ content: 'Error: User Id already registered', ephemeral: true });
          } else {
            await coll.insertOne({userId:interaction.user.id, userName:interaction.user.username, userDiscriminator:interaction.user.discriminator, userAvatar:interaction.user.avatar, userDateRegistered:Date.now()});
            //ensure the user is registered
          if (await coll.findOne({userId:interaction.user.id})){
            await interaction.reply({ content: 'User Id registered', ephemeral: true });
            } else {
              await interaction.reply({ content: 'Error: unknown registration failure', ephemeral: true });
            }

        }
          } finally {
            // Ensures that the client will close when you finish/error
            await dbClient.close();
          }

	},
};