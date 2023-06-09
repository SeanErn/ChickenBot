const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, Message } = require("discord.js");
const { MongoClient } = require("mongodb");
const serverUri = process.env["SERVERURI"]
const dbClient = new MongoClient(serverUri);

    async function registerTeamIfNotRegistered(interaction, teamName){
    const db = dbClient.db("chickenBot");
    const coll = db.collection("chickenBotTeamData");
    let teamsChannel = interaction.guild.channels.cache.find(channel => channel.name === "🙏🏽-team-select");

    const messages = await teamsChannel.messages.fetch({ limit: 100 });
    const messageWithEmbed = messages.find(msg => msg.embeds.some(embed => embed.title === 'Team | ' + teamName));
    if (messageWithEmbed) {
      console.log(messageWithEmbed.id);
    } else {
      console.log('No message found with embed title');
    }
    
    try {
            await dbClient.connect();

            // creates a new team and registers the user to it if the team does not exist
            if (await coll.findOne({ name:teamName }) == null){
                console.log("Team does not exist!")
                await coll.insertOne({name:teamName, members:[]});
            }
            //register the user to the team if the team allready exists
            if (await coll.findOne({"members":interaction.user.id}) == null){
                console.log("User is not registered to a team!")
                await coll.updateOne({ name:teamName }, { $push: { members: interaction.user.id } });
            }

            //Construct embeds
            const embed = new EmbedBuilder()
            .setTitle("Team | " + teamName)
            .setDescription("Team created by " + interaction.user.username + "#" + interaction.user.discriminator)
            .addFields(
                { name: 'Members', value: teamMembers },
            );
            console.log(embed);
            
        } finally {
            // Ensures that the client will close when you finish/error
            await dbClient.close();
        }
    }   
module.exports = {registerTeamIfNotRegistered};