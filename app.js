import { getCookies } from "./backend/cookieHandler.js";
import { csvParser } from "./backend/csvParser.js";
import { JsonHandler } from "./backend/JsonHandler.js";
import express from "express";

const app = express();
const APP_PORT = 8080;

app.set('view engine', 'ejs');

app.get("/", (request, response) => {
  response.render('pages/home');
});

app.get("/generateClass", (request, response) => {
  response.render("pages/generatedClassPage");
})

app.get("/getWeapons", (request, response) => {
  let parser = new csvParser();
  let jsonHandler = new JsonHandler();

  let primaries = {};
  let secondaries = {};
  let melees = {};

  let lethals = parser.getEquipmentFromCSV("Weapon_data/Lethal_data.csv");
  let tacticals = parser.getEquipmentFromCSV("Weapon_data/Tactical_data.csv");
  let fieldUpgrades = parser.getEquipmentFromCSV("Weapon_data/FieldUpgrade_data.csv");

  let enforcerPerks = parser.getEquipmentFromCSV("Weapon_data/EnforcerPerk_data.csv");
  let reconPerks = parser.getEquipmentFromCSV("Weapon_data/ReconPerk_data.csv");
  let strategistPerks = parser.getEquipmentFromCSV("Weapon_data/SpecialistPerk_data.csv");
  let firstPerk = parser.getEquipmentFromCSV("Weapon_data/FirstPerk_data.csv");
  let secondPerk = parser.getEquipmentFromCSV("Weapon_data/SecondPerk_data.csv");
  let thirdPerk = parser.getEquipmentFromCSV("Weapon_data/ThirdPerk_data.csv");

  let wildcards = parser.getEquipmentFromCSV("Weapon_data/Wildcard_data.csv");

  let scorestreaks = parser.getEquipmentFromCSV("Weapon_data/Scorestreak_data.csv");

  let primaryFiles = ["Weapon_data/AR_data.csv", "Weapon_data/SMG_data.csv", "Weapon_data/Shotgun_data.csv", "Weapon_data/LMG_data.csv", "Weapon_data/MarksmanRifle_data.csv", "Weapon_data/SniperRifle_data.csv"];
  let secondaryFiles = ["Weapon_data/Pistol_data.csv", "Weapon_data/Launcher_data.csv"];
  primaryFiles.forEach((file) => {
    Object.assign(primaries, parser.getWeaponsFromCSV(file));
  })
  secondaryFiles.forEach((file) => {
    Object.assign(secondaries, parser.getWeaponsFromCSV(file));
  })

  Object.assign(melees, parser.getWeaponsFromCSV("Weapon_data/Melee_data.csv"));

  let curLevel = getCookies(request, 'curLevel');
  if (curLevel == "") {
    curLevel = 1;
  }

  let randomPrimary = jsonHandler.getRandomItemsFromJSON({...primaries}, curLevel);
  let randomSecondary = jsonHandler.getRandomItemsFromJSON({...secondaries}, curLevel);
  let randomMelee = jsonHandler.getRandomItemsFromJSON({...melees}, curLevel);

  let randomWildcard = Object.keys(jsonHandler.getRandomItemsFromJSON({...wildcards}, curLevel))[0];

  let amountOfLethals = (randomWildcard == "Danger Close") ? 2: 1;
  let randomLethal = jsonHandler.getRandomItemsFromJSON({...lethals}, curLevel);
  randomLethal = [Object.keys(randomLethal)[0]];
  if (amountOfLethals == 2) {
    randomLethal = [...randomLethal, ...randomLethal];
  }

  let amountOfTacticals = (randomWildcard == "Tactical Expert") ? 3: 1;
  let randomTactical = jsonHandler.getRandomItemsFromJSON({...tacticals}, curLevel);
  randomTactical = [Object.keys(randomTactical)[0]];
  if (amountOfTacticals == 3) {
    randomTactical = [...randomTactical, ...randomTactical, ...randomTactical];
  }

  let amountOfPerks = (randomWildcard == "Perk Greed") ? 4: 3;
  let randomPerks = [Object.keys(jsonHandler.getRandomItemsFromJSON({...firstPerk}, curLevel))[0], Object.keys(jsonHandler.getRandomItemsFromJSON({...secondPerk}, curLevel))[0], Object.keys(jsonHandler.getRandomItemsFromJSON({...thirdPerk}, curLevel))[0]];
  if (amountOfPerks == 4) {
    let leftPerks = {...firstPerk, ...secondPerk, ...thirdPerk};
    for (const perk in randomPerks) {
      delete leftPerks[randomPerks[perk]];
    }
    randomPerks = [...randomPerks, Object.keys(jsonHandler.getRandomItemsFromJSON({...leftPerks}, curLevel))[0]];
  }
  randomPerks = jsonHandler.addSpecialPerk(randomPerks, enforcerPerks, reconPerks, strategistPerks);

  let amountOfStreaks = (randomWildcard == "High Roller") ? 4: 3;
  let randomScorestreaks = [];
  for (let i = 0; i < amountOfStreaks; i++) {
    let newScorestreaks = {...scorestreaks};
    for (const key in randomScorestreaks) {
      if (Object.keys(newScorestreaks).includes(randomScorestreaks[key])) {
        delete newScorestreaks[randomScorestreaks[key]];
      }
    }
    randomScorestreaks = [...randomScorestreaks, Object.keys(jsonHandler.getRandomItemsFromJSON({...newScorestreaks}, curLevel))[0]];
  }
  randomScorestreaks.sort((a, b) => Object.keys(scorestreaks).indexOf(a) - Object.keys(scorestreaks).indexOf(b));

  let amountOfFieldUpgrades = (randomWildcard == "Prepper") ? 2: 1;
  let randomFieldUpgrades = [Object.keys(jsonHandler.getRandomItemsFromJSON({...fieldUpgrades}, curLevel))[0]];
  if (amountOfFieldUpgrades == 2) {
    randomFieldUpgrades = [...randomFieldUpgrades, Object.keys(jsonHandler.getRandomItemsFromJSON({...fieldUpgrades}, curLevel))[0]];
  }

  let amountOfAttachments = (randomWildcard == "Gunfighter") ? 8: 5;
  randomPrimary = jsonHandler.getRandomAttachments({...randomPrimary}, amountOfAttachments);

  if (randomWildcard == "Overkill") {
    delete primaries[Object.keys(randomPrimary)[0]];
    randomSecondary = jsonHandler.getRandomItemsFromJSON({...primaries}, curLevel);
  }

  randomSecondary = jsonHandler.getRandomAttachments({...randomSecondary}, 5);

  response.status(200).json({primary: randomPrimary, secondary: randomSecondary, melee: randomMelee, lethal: randomLethal, tactical: randomTactical, fieldUpgrade: randomFieldUpgrades, perks: randomPerks, wildcard: randomWildcard, scorestreaks: randomScorestreaks});
});

app.get("/disclaimer", (request, response) => {
  response.render("pages/disclaimer");
})



app.use(express.static("public"));// Middleware for unknown routes
// Must be last in pipeline
app.use((request, response, next) => {
  response.status(404).send("Sorry can't find that!");
});

// Middleware for error handling
app.use((error, request, response, next) => {
  console.error(error.stack);
  response.status(500).send("Something broke!");
});

app.listen(APP_PORT, () => {
  console.log(`server started on port ${APP_PORT}`)
})