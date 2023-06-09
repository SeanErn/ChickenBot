const { MongoClient } = require("mongodb");
const serverUri = process.env["SERVERURI"]
const dbClient = new MongoClient(serverUri);

    async function registerUserIfNotRegistered(user){
    const db = dbClient.db("chickenBot");
    const coll = db.collection("chickenBotUserData");
    try {
                await dbClient.connect();

                //register the users if they are not already registered
                if (await coll.findOne({userId:user.id}) == null){
                    console.log("New user registered!");
                    await coll.insertOne({userId:user.id, userName:user.username, userDiscriminator:user.discriminator, userAvatar:user.avatar, userDateRegistered:Date.now()});
                }
        } finally {
            // Ensures that the client will close when you finish/error
            await dbClient.close();
        }
    }   
module.exports = {registerUserIfNotRegistered};