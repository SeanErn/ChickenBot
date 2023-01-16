const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { MongoClient } = require("mongodb");
const serverUri = process.env["SERVERURI"]

const dbClient = new MongoClient(serverUri);
module.exports = {
	data: new SlashCommandBuilder()
		.setName('count')
		.setDescription('How far can you count?')
        .addIntegerOption(option => option.setName('number').setDescription('Number to count to')),
	async execute(interaction) {
        try {
            //await dbClient.connect();
            // database and collection code goes here
           // const db = dbClient.db("chickenBotUserData");
            //const coll = db.collection("chickenBotUserData");
            
            //Build the embed
            const countEmbed = new EmbedBuilder()
	            .setColor(0x0099FF)
	            .setTitle('Start counting!')
	            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
	            .setDescription(`${interaction.user.username} started a counting game! Count to ${interaction.options.getInteger('number')}`)
	            .setTimestamp()
	.setFooter({ text: 'ChickenBot#8757'});

    // Create a message collector that will listen for numbers in the channel the command was used in
    const filter = m => !isNaN(m.content);
    const collector = interaction.channel.createMessageCollector({ filter, time: 15000 });

    await interaction.reply({ embeds: [countEmbed] });

    collector.on('collect', m => {
      console.log(`Collected ${m.content}`);
    });
    collector.on('end', collected => {
      console.log(`Collected ${collected.size} items`);
    });
  
          } finally {
            // Ensures that the client will close when you finish/error
            //await dbClient.close();
          }

	},
};