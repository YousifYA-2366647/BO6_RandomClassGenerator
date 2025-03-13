import { getCookies } from "./backend/cookieHandler.js";
import { JsonParser } from "./backend/JsonParser.js";
import { JsonHandler } from "./backend/JsonHandler.js";
import express from "express";

const app = express();
const APP_PORT = 8080;

const primaryRetriever = new JsonParser();
const secondaryRetriever = new JsonParser();
const meleeRetriever = new JsonParser();
const lethalRetriever = new JsonParser();
const tacticalRetriever = new JsonParser();
const fieldUpgradeRetriever = new JsonParser();
const enforcerRetriever = new JsonParser();
const reconRetriever = new JsonParser();
const strategistRetriever = new JsonParser();
const firstPerkRetriever = new JsonParser();
const secondPerkRetriever = new JsonParser();
const thirdPerkRetriever = new JsonParser();
const wildcardRetriever = new JsonParser();
const scorestreakRetriever = new JsonParser();

app.set('view engine', 'ejs');

app.get("/", (request, response) => {
  response.render('pages/home');
});

app.get("/generateClass", (request, response) => {
  response.render("pages/generatedClassPage");
})

app.get("/getWeapons", async (request, response) => {
  let jsonHandler = new JsonHandler();

  let primaries = {};
  let secondaries = {};
  let melees = await meleeRetriever.getWeaponsFromJson("Weapon_data/Melee_data.json");

  let lethals = await lethalRetriever.getWeaponsFromJson("Weapon_data/Lethal_data.json");
  let tacticals = await tacticalRetriever.getWeaponsFromJson("Weapon_data/Tactical_data.json");
  let fieldUpgrades = await fieldUpgradeRetriever.getWeaponsFromJson("Weapon_data/FieldUpgrade_data.json");

  let enforcerPerks = await enforcerRetriever.getWeaponsFromJson("Weapon_data/EnforcerPerk_data.json");
  let reconPerks = await reconRetriever.getWeaponsFromJson("Weapon_data/ReconPerk_data.json");
  let strategistPerks = await strategistRetriever.getWeaponsFromJson("Weapon_data/SpecialistPerk_data.json");
  let firstPerk = await firstPerkRetriever.getWeaponsFromJson("Weapon_data/FirstPerk_data.json");
  let secondPerk = await secondPerkRetriever.getWeaponsFromJson("Weapon_data/SecondPerk_data.json");
  let thirdPerk = await thirdPerkRetriever.getWeaponsFromJson("Weapon_data/ThirdPerk_data.json");

  let wildcards = await wildcardRetriever.getWeaponsFromJson("Weapon_data/Wildcard_data.json");

  let scorestreaks = await scorestreakRetriever.getWeaponsFromJson("Weapon_data/Scorestreak_data.json");

  let primaryFiles = ["Weapon_data/AR_data.json", "Weapon_data/SMG_data.json", "Weapon_data/Shotgun_data.json", "Weapon_data/LMG_data.json", "Weapon_data/MarksmanRifle_data.json", "Weapon_data/SniperRifle_data.json"];
  let secondaryFiles = ["Weapon_data/Pistol_data.json", "Weapon_data/Launcher_data.json", "Weapon_data/Specials_data.json"];

  const primaryWeapons = await Promise.all(primaryFiles.map(file => primaryRetriever.getWeaponsFromJson(file)));
  primaryWeapons.forEach(value => Object.assign(primaries, value));
  
  const secondaryWeapons = await Promise.all(secondaryFiles.map(file => secondaryRetriever.getWeaponsFromJson(file)));
  secondaryWeapons.forEach(value => Object.assign(secondaries, value));

  let curLevel = getCookies(request, 'curLevel');
  let includeDLC = (getCookies(request, 'includeDLC').toLowerCase() === "true");
  if (curLevel == "") {
    curLevel = 1;
  }

  let randomPrimary = jsonHandler.getRandomItemsFromJSON({...primaries}, curLevel, includeDLC);
  let randomSecondary = jsonHandler.getRandomItemsFromJSON({...secondaries}, curLevel, includeDLC);
  let randomMelee = jsonHandler.getRandomItemsFromJSON({...melees}, curLevel, includeDLC);

  let randomWildcard = Object.keys(jsonHandler.getRandomItemsFromJSON({...wildcards}, curLevel, includeDLC))[0];

  let amountOfLethals = (randomWildcard == "Danger Close") ? 2: 1;
  let randomLethal = jsonHandler.getRandomItemsFromJSON({...lethals}, curLevel, includeDLC);
  randomLethal = [Object.keys(randomLethal)[0]];
  if (amountOfLethals == 2) {
    randomLethal = [...randomLethal, ...randomLethal];
  }

  let amountOfTacticals = (randomWildcard == "Tactical Expert") ? 3: 1;
  let randomTactical = jsonHandler.getRandomItemsFromJSON({...tacticals}, curLevel, includeDLC);
  randomTactical = [Object.keys(randomTactical)[0]];
  if (amountOfTacticals == 3) {
    randomTactical = [...randomTactical, ...randomTactical, ...randomTactical];
  }

  let amountOfPerks = (randomWildcard == "Perk Greed") ? 4: 3;
  let randomPerks = [Object.keys(jsonHandler.getRandomItemsFromJSON({...firstPerk}, curLevel, includeDLC))[0], Object.keys(jsonHandler.getRandomItemsFromJSON({...secondPerk}, curLevel))[0], Object.keys(jsonHandler.getRandomItemsFromJSON({...thirdPerk}, curLevel))[0]];
  if (amountOfPerks == 4) {
    let leftPerks = {...firstPerk, ...secondPerk, ...thirdPerk};
    for (const perk in randomPerks) {
      delete leftPerks[randomPerks[perk]];
    }
    randomPerks = [...randomPerks, Object.keys(jsonHandler.getRandomItemsFromJSON({...leftPerks}, curLevel, includeDLC))[0]];
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
    randomScorestreaks = [...randomScorestreaks, Object.keys(jsonHandler.getRandomItemsFromJSON({...newScorestreaks}, curLevel, includeDLC))[0]];
  }
  randomScorestreaks.sort((a, b) => Object.keys(scorestreaks).indexOf(a) - Object.keys(scorestreaks).indexOf(b));

  let amountOfFieldUpgrades = (randomWildcard == "Prepper") ? 2: 1;
  let randomFieldUpgrades = [Object.keys(jsonHandler.getRandomItemsFromJSON({...fieldUpgrades}, curLevel, includeDLC))[0]];
  if (amountOfFieldUpgrades == 2) {
    randomFieldUpgrades = [...randomFieldUpgrades, Object.keys(jsonHandler.getRandomItemsFromJSON({...fieldUpgrades}, curLevel, includeDLC))[0]];
  }

  let amountOfAttachments = (randomWildcard == "Gunfighter") ? 8: 5;
  randomPrimary = jsonHandler.getRandomAttachments({...randomPrimary}, amountOfAttachments);

  if (randomWildcard == "Overkill") {
    delete primaries[Object.keys(randomPrimary)[0]];
    randomSecondary = jsonHandler.getRandomItemsFromJSON({...primaries, ...secondaries}, curLevel, includeDLC);
  }

  randomSecondary = jsonHandler.getRandomAttachments({...randomSecondary}, 5);

  if (randomWildcard == "Flyswatter") {
    let launchers = await secondaryRetriever.getWeaponsFromJson("Weapon_data/Launcher_data.json");
    if (Object.keys(launchers).includes(Object.keys(randomSecondary)[0])) {
      delete launchers[Object.keys(randomSecondary)[0]]
    }
    randomMelee = jsonHandler.getRandomItemsFromJSON(launchers);
  }

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