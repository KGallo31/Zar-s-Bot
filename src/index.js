require("dotenv").config();
const { Client, IntentsBitField } = require("discord.js");
const fs = require('fs');


const GenerateSPAPack = () => {
  const pack = {
    "Tier1" : {
      "pets": RandomPetSelection(tier1PetsList),
      "food": RandomFoodSelection(tier1FoodList)
    },
    "Tier2" : {
      "pets": RandomPetSelection(tier2PetsList),
      "food": RandomFoodSelection(tier2FoodList)
    },
    "Tier3" : {
      "pets": RandomPetSelection(tier3PetsList),
      "food": RandomFoodSelection(tier3FoodList)
    },
    "Tier4" : {
      "pets": RandomPetSelection(tier4PetsList),
      "food": RandomFoodSelection(tier4FoodList)
    },
    "Tier5" : {
      "pets": RandomPetSelection(tier5PetsList),
      "food": RandomFoodSelection(tier5FoodList)
    },
    "Tier6" : {
      "pets": RandomPetSelection(tier6PetsList),
      "food": RandomFoodSelection(tier6FoodList)
    }
  }
  return pack;
}

const GenerateList = (amountOfPetsInTier) => {
  const arr = []
  for(let i = 1; i < amountOfPetsInTier + 1;i++){
    arr.push(i.toString())
  }
  return arr;
} 

const RandomPetSelection = (arr) => {
  const selectedPets = []
  for (let i = 0; i < 10; i++){
    let randomPet = arr[Math.floor(Math.random() * arr.length)]
    selectedPets.push(randomPet)
  }
  return selectedPets;
}

const RandomFoodSelection = (arr) => {
  const selectedFoods = []
  for (let i = 0; i < 3; i++){
    let randomFood = arr[Math.floor(Math.random() * arr.length)]
    selectedFoods.push(randomFood)
  }
  return selectedFoods;
} 

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

const client = new Client({
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMembers,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.MessageContent,
    ],
  }
);

const tier1PetsList = GenerateList(35)
const tier1FoodList = GenerateList(8)

const tier2PetsList = GenerateList(40)
const tier2FoodList = GenerateList(8)

const tier3PetsList = GenerateList(45)
const tier3FoodList = GenerateList(9)

const tier4PetsList = GenerateList(45)
const tier4FoodList = GenerateList(11)

const tier5PetsList = GenerateList(44)
const tier5FoodList = GenerateList(10)

const tier6PetsList = GenerateList(43)
const tier6FoodList = GenerateList(13)


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

  if (messageAttachments.size == 0 && !textMessage.includes("!")) {
    console.log("message sent but no attatchments were found");
    return
  }

  const textMessage = message.content.toLowerCase();
  const messageAttachments = message.attachments;

  if(!HasAnyImages(messageAttachments) && !textMessage.includes("!")){
    console.log("No images were sent with the message")
    return;
  }else{
    const images = OnlyImageAttatchments(messageAttachments);

    const user = message.author.id;
  
    RaiseUserWinCount(images,user);
  }

  if (!textMessage.includes("!")) return;

  if (textMessage.includes("newpack")){
    message.reply(JSON.stringify(GenerateSPAPack()))
  }

});

// Log in to Discord with your app's token
client.login( process.env.TOKEN);
