require("dotenv").config();
const { Client, IntentsBitField } = require("discord.js");
const fs = require('fs');

const client = new Client({
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMembers,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.MessageContent,
    ],
  });const prefix = '!'; // Change this to your desired command prefix

// Load existing user data from a file
let userData = {};
try {
  userData = require('../userData.json');
} catch (err) {
  console.error('Error loading user data:', err.message);
}

client.on('messageCreate', (message) => {
  // Ignore messages from bots or no attachments
  if (message.author.bot) return;

  if (message.attachments.size == 0) {
    console.log("message sent but no attatchments were found");
    return
  }

  if(!HasAnyImages(message.attachments)){
    console.log("No imaees were sent with th")
    return;
  }

  const images = OnlyImageAttatchments(message.attachments);

  const user = message.author.id;

  RaiseUserWinCount(images,user);

});

const RaiseUserWinCount = (images, user) => {
  if (user in userData){
    userData[user] += images.size;
  }else{
    userData[user] = 1;
  }
  fs.writeFileSync('./userData.json', JSON.stringify(userData, null, 2));
}

const OnlyImageAttatchments = (attachments) => attachments.filter(attatchment => attatchment.contentType.includes("image"))

const HasAnyImages = (attachments) => {
  let foundImage = false;
  attachments.forEach(attatchment => {
    if (attatchment.contentType.includes("image")) foundImage = true;
  })
  return foundImage;
}

// Log in to Discord with your app's token
client.login( process.env.TOKEN);
