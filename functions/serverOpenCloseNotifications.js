const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, Message } = require("discord.js");

const notifcationChannel = "1116499915267375144";

function serverOpen(client){
    console.log("serverOpen");
    //Construct embed for server open
    const open = new EmbedBuilder()
    .setTitle("Server is open!")
    .setDescription("The server is open for the next 6 hours! Join now!")
    .addFields(
        { name: 'Open time', value: `<t:${(Math.round(Date.now() / 1000))}:R>`},
        { name: 'Close time', value: `<t:${(Math.round(Date.now() / 1000))+21600}:R>`}
    );
    console.log(open);
    client.channels.fetch(notifcationChannel).then(channel => channel.send({ content: '<@&1116560178045796372> Server is open!', embeds: [open], roles: ['1116560178045796372'] }));
}
function serverClose(client){
    console.log("serverClose");
    //Construct embed for server close
    const close = new EmbedBuilder()
    .setTitle("Server is closed!")
    .setDescription("The server is closed for the next 18 hours! See you tomorrow!")
    .addFields(
        { name: "Time til' open", value: `<t:${(Math.round(Date.now() / 1000))+64800}:R>`},
        { name: 'Time since closed', value: `<t:${(Math.round(Date.now() / 1000))}:R>`}
    );
    console.log(close);
    client.channels.fetch(notifcationChannel).then(channel => channel.send({ content: '<@&1116560178045796372> Server has closed', embeds: [close], roles: ['1116560178045796372'] }));
}
function serverOpeningIn15m(client){
    console.log("serverOpeningIn15m");
    //Construct embed for server close
    const opening = new EmbedBuilder()
    .setTitle("Server is opening in 15 minutes!")
    .setDescription("The server is opening in 15 minutes! Get ready!")
    .addFields(
        { name: "Time til' open", value: `<t:${(Math.round(Date.now() / 1000))+900}:R>`}
    );
    console.log(opening);
    client.channels.fetch(notifcationChannel).then(channel => channel.send({ content: '<@&1116560178045796372> Server is opening in 15 minutes!', embeds: [opening], roles: ['1116560178045796372']  }));
}

module.exports = {serverOpen, serverClose, serverOpeningIn15m};