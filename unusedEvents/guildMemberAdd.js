const { registerUserIfNotRegistered } = require("../functions/registerUserIfNotRegistered");

module.exports = {
    name: 'guildMemberAdd',
    execute(member) {
      try {
        // Add the user to the database
        console.log(`Added ${member.user.username} to the database.`);
        registerUserIfNotRegistered(member.user);
      } catch (error) {
        console.error(error);
      }
    },
  };