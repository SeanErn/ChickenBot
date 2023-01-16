const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require("discord.js");
const { MongoClient } = require("mongodb");
const serverUri = process.env["SERVERURI"]

const dbClient = new MongoClient(serverUri);
const dbDareClient = new MongoClient(serverUri);
module.exports = {
	data: new SlashCommandBuilder()
		.setName("chickengame")
		.setDescription("Play a game of chicken with your friends!")
        .addIntegerOption(numberofdares => numberofdares.setName("numberofdares").setDescription("This option will determine how many dares will be in the game.").setRequired(true))
        .addBooleanOption(includevc => includevc.setName("includevc").setDescription("This option will include Chickens only relevant if the participants are in a voice channel together.").setRequired(true))
        .addIntegerOption(numberofchickens => numberofchickens.setName("numberofchickens").setDescription("This option will determine how many chickens one player will have").setRequired(true))
        .addUserOption(mentionable => mentionable.setName("playerone").setDescription("Player 1 of the game.").setRequired(true))
        .addUserOption(mentionable => mentionable.setName("playertwo").setDescription("Player 2 of the game.").setRequired(true))
        .addUserOption(mentionable => mentionable.setName("playerthree").setDescription("Player 3 of the game.").setRequired(false))
        .addUserOption(mentionable => mentionable.setName("playerfour").setDescription("Player 4 of the game.").setRequired(false)),
	async execute(interaction) {
        try {
            var players = [];
            const db = dbClient.db("chickenBotUserData");
            const coll = db.collection("chickenBotUserData");
            await dbClient.connect();
                        //Get the number of players
                        if (interaction.options.getUser("playerthree") == null){
                            var playerthree = "None";
                            var postGameP3 = ""; 
                            players = [interaction.options.getUser("playerone"), interaction.options.getUser("playertwo")];
                        } else {
                            var playerthree = interaction.options.getUser("playerthree");
                            var dbPlayerthree = await coll.findOne({userId:playerthree.id});
                            var postGameP3 = `3. ${playerthree} had ${dbPlayerthree.chickensRemaining} chickens left \n`;
                            players = [interaction.options.getUser("playerone"), interaction.options.getUser("playertwo"), interaction.options.getUser("playerthree")];
                        }
                        if (interaction.options.getUser("playerfour") == null){
                            var playerfour = "None";
                            var postGameP4 = "";
                        } else {
                            var playerfour = interaction.options.getUser("playerfour");
                            var dbPlayerfour = await coll.findOne({userId:playerfour.id});
                            var postGameP4 = `4. ${playerfour} had ${dbPlayerfour.chickensRemaining} chickens left \n`;
                            players = [interaction.options.getUser("playerone"), interaction.options.getUser("playertwo"), interaction.options.getUser("playerthree"), interaction.options.getUser("playerfour")];
                        }
            
                        var currentPlayer = interaction.options.getUser("playerone");
                        var currentDare = 1;


            //console.log(players);

            // database and collection code goes here

            players.forEach(async function(player){
                //connect to db
                const db = dbClient.db("chickenBotUserData");
                const coll = db.collection("chickenBotUserData");
                dbPlayer = await coll.findOne({userId:player.id});

            //register the players if they are not already registered
            if (await coll.findOne({userId:player.id}) == null){
                console.log("New user registered!");
                await coll.insertOne({userId:player.id, userName:player.username, userDiscriminator:player.discriminator, userAvatar:player.avatar, userDateRegistered:Date.now()});
            }
                //ensure the user is registered
              if (await coll.findOne({userId:player.id})){
                    console.log("User updated!");
                    await coll.updateOne({userId:player.id},{$set: {gameInProgress:true,gameDateStarted:Date.now(), chickensRemaining:interaction.options.getInteger("numberofchickens")}});                 
                }
            });
            //When the game is over, update the database
            const gameEnd = async () => {
                const db = dbClient.db("chickenBotUserData");
                const coll = db.collection("chickenBotUserData");
                players.forEach(async function(player){
                    //connect to db
                    dbPlayer = await coll.findOne({userId:player.id});
                await coll.updateOne({userId:player.id},{$set: {gameInProgress:false}});
                });
            }

    

            //Build the embed
            const embed = new EmbedBuilder()
                .setTitle("Chicken Game")
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                .setDescription(`${interaction.user.username} started a chicken game!`)
                .addFields(
                    { name: "Number of Dares", value: `${interaction.options.getInteger("numberofdares")}`, inline: true },
                    { name: "Include VC Chickens", value: `${interaction.options.getBoolean("includevc")}`, inline: true },
                    { name: "Number of Chickens", value: `${interaction.options.getInteger("numberofchickens")}`, inline: true },
                    { name: "Player 1", value: `${interaction.options.getUser("playerone")}`, inline: true },
                    { name: "Player 2", value: `${interaction.options.getUser("playertwo")}`, inline: true },
                    { name: "Player 3", value: `${playerthree}`, inline: true },
                    { name: "Player 4", value: `${playerfour}`, inline: true },
                )
                .setTimestamp()
                .setFooter({ text: "ChickenBot#8757"});
            

            const gameRules = new EmbedBuilder()
                .setTitle("Chicken Game")
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                .setDescription("Welcome to the game of chicken! please read these rules, then click the next button to start the game.")
                .addFields(
                    {name: "Rules", value: `1. The game will start with a random player. \n 2. The player will be given a dare. \n 3. The player will then have 15 seconds to decide if they will chicken out or not. \n 4. If they chicken out, they will be given a new dare and will lose one of their ${interaction.options.getInteger("numberofchickens")} chickens \n 5. If they do not chicken out, they must complete the dare \n 6. The game will continue until you finish ${interaction.options.getInteger("numberofdares")} collectively \n 7. Each player starts with ${interaction.options.getInteger("numberofchickens")} chickens. \n`}
                );

            const dareDb = dbDareClient.db("chickenBotChickens");
            const dareColl = dareDb.collection("chickenBotChickens"); 
            var userInDB = await coll.findOne({userId:currentPlayer.id});
            var dare = await dareColl.findOne({INDEX:`${Math.random() * (Math.floor(26) - Math.ceil(0)) + Math.ceil(0)}`})
                    console.log(dare);
            const duringGame = new EmbedBuilder()
                .setTitle("Chicken Game")
                .setAuthor({ name: `${currentPlayer.username}`})
                .setDescription(`It is ${currentPlayer.username}'s turn!`)
                .addFields(
                    {name: "Dare Number", value: `${currentDare}/${interaction.options.getInteger("numberofdares")}`},
                    {name: "Chicken's remaining", value: `${userInDB.chickensRemaining} chickens`},
                    {name: "Dare", value: `${dare}`},
                );

                var dbPlayerone = await coll.findOne({userId:interaction.options.getUser("playerone").id});
                var dbPlayertwo = await coll.findOne({userId:interaction.options.getUser("playertwo").id});
            const postGame = new EmbedBuilder()
                .setTitle("Chicken Game")
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                .setDescription("The game has ended! Thanks for playing!")
                .addFields(
                    {name: "Results", value: `1. ${interaction.options.getUser("playerone")} had ${dbPlayerone.chickensRemaining } chickens left \n 2. ${interaction.options.getUser("playertwo")} had ${dbPlayertwo.chickensRemaining} chickens left \n ${postGameP3} ${postGameP4}`}
                );
                

            //Build the buttons
            const pregame = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('startgame_PREGAME')
					.setLabel('Start Game')
					.setStyle(ButtonStyle.Success),
			);
            const pregameRules = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("next_PREGAMERULES")
                    .setLabel("Next")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("stopgame_PREGAMERULES")
                    .setLabel("Stop Game")
                    .setStyle(ButtonStyle.Danger),
            );
            const ingame = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("next_INGAME")
                    .setLabel("Next")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("chickenout")
                    .setLabel("🐔")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId("stopgame_INGAME")
                    .setLabel("Stop Game")
                    .setStyle(ButtonStyle.Danger),
            );


            var filter = i => i.customId === 'startgame_PREGAME' || i.customId === 'next_PREGAMERULES' || i.customId === 'stopgame_PREGAMERULES' || i.customId === 'next_INGAME' || i.customId === 'chickenout' || i.customId === 'stopgame_INGAME' && i.user.id === currentPlayer.id;

            const collectorPregame = interaction.channel.createMessageComponentCollector({ filter, time: 600*1000 });
            
            collectorPregame.on('collect', async i => {
                    //PREGAME
                    if (i.customId === 'startgame_PREGAME') {
                        await i.update({ embeds: [gameRules], components: [pregameRules] });
                    }
                    //PREGAME RULES
                    else if (i.customId === 'next_PREGAMERULES') {
                        await i.update({ embeds: [duringGame], components: [ingame] });
                    }
                    else if (i.customId === 'stopgame_PREGAMERULES') {
                        await i.update({ embeds: [postGame], components: [] });
                        //gameEnd();
                    }
                    //INGAME
                    else if (i.customId === 'next_INGAME') {
                        await i.update({ embeds: [duringGame], components: [ingame] });
                    }
                    else if (i.customId === 'chickenout') {
                        await i.update({ embeds: [gameRules], components: [ingame] });
                    }
                    else if (i.customId === 'stopgame_INGAME') {
                        await i.update({ embeds: [postGame], components: [] });
                       // gameEnd();
                    }
            }); //.catch(console.error);

            /*
            //PREGAME RULES
            var rulesFilter = i => i.customId === 'next' || i.customId === 'stopgame' && i.user.id === currentPlayer.user.id;

            const collectorRules = interaction.channel.createMessageComponentCollector({ rulesFilter, time: 120000 });
            
            collectorRules.on('collect', async i => {
                if (i.customId === 'next') {
                    await i.update({ embeds: [gameRules], components: [ingame] });

                } else if (i.customId === 'stopgame') {
                    await i.update({ embeds: [postGame], components: [] });
                }
            });
            */
            //GAME SETTINGS
            await interaction.reply({ embeds: [embed], components: [pregame] });

          } finally {
            // Ensures that the client will close when you finish/error
            //await dbClient.close();
          }

	},
};