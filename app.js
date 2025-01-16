const fs = require('fs');
const { parse } = require('csv-parse');
const express = require('express');

const app = express();
const APP_PORT = 8080;

function getCookies(req, cookieName) {
  const cookies = req.headers.cookie;
  if (!cookies) return "";

  const cookieArray = cookies.split("; ");
  for (let cookie of cookieArray) {
    const [key, value] = cookie.split("=");
    if (key === cookieName) {
      return decodeURIComponent(value);
    }
  }
  return "";
}

function getWeaponsFromCSV(fileName) {
  weapons = {};
  curWeapon = "";

  const fileContent = fs.readFileSync(fileName, 'utf-8');
  fileContent.split("\n").forEach(line => {
    line = line.trim().replace(/\n/g, '')
    let records = line.split(";");
    if (records.length != 0) {
      if (records[0] == "Name") {
        weapons[records[1]] = {};
        curWeapon = records[1];
      }
      else if (records[0] == "Level") {
        weapons[curWeapon][records[0]] = parseInt(records[1]);
      }
      else {
        var attachments = records.slice(1, records.length);
        var randomAttachment = attachments[Math.floor(Math.random()*(records.length-1))];
        weapons[curWeapon][records[0]] = randomAttachment;
      }
    }
  })

  return weapons;
}

function getEquipmentFromCSV(fileName) {
  equipment = {};
  curEquipment = "";

  const fileContent = fs.readFileSync(fileName, 'utf-8');
  fileContent.split("\n").forEach(line => {
    line = line.trim().replace(/\n/g, '')
    let records = line.split(";");
    if (records.length != 0) {
      if (records[0] == "Name") {
        equipment[records[1]] = {};
        curEquipment = records[1];
      }
      else if (records[0] == "Level") {
        equipment[curEquipment][records[0]] = parseInt(records[1]);
      }
    }
  })

  return equipment;
}

function filterItems(JsonObject, curLevel) {
  for (const key in JsonObject) {
    if (JsonObject[key]['Level'] > curLevel) {
      delete JsonObject[key];
    }
    else {
      delete JsonObject[key]['Level'];
    }
  }
}

function getRandomItemsFromJSON(JsonObject, curLevel) {
  if (Object.keys(JsonObject).length == 0) {
    return {};
  }

  filterItems(JsonObject, curLevel);

  let randomEntry = Object.entries(JsonObject)[Math.floor(Math.random()*Object.keys(JsonObject).length)];

  let randomKey = randomEntry[0];
  let randomJson = {};
  randomJson[randomKey] = randomEntry[1];

  return randomJson;
}

function getRandomAttachments(weaponJson, amount) {
  let weaponName = Object.keys(weaponJson)[0];
  let attachments = weaponJson[weaponName];
  
  let nonEmptyKeys = Object.keys(attachments).filter(key => attachments[key] !== "");

  let attachmentsToRemove = Math.max(0, nonEmptyKeys.length - amount);

  for (let i = 0; i < attachmentsToRemove; i++) {
    let randomIndex = Math.floor(Math.random() * nonEmptyKeys.length);
    let randomKey = nonEmptyKeys[randomIndex];

    attachments[randomKey] = "";

    nonEmptyKeys.splice(randomIndex, 1);
  }

  return weaponJson;
}


function addSpecialPerk(perks, enforcer, recon, specialist) {
  let amountOfE = 0;
  let amountOfR = 0;
  let amountOfS = 0;

  for (const perk in perks) {
    if (Object.keys(enforcer).includes(perks[perk])) {
      amountOfE++;
    }
    else if (Object.keys(recon).includes(perks[perk])) {
      amountOfR++;
    }
    else if (Object.keys(specialist).includes(perks[perk])) {
      amountOfS++;
    }
  }

  if (amountOfE >= 3) {
    perks.push("Enforcer");
  }
  else if (amountOfR >= 3) {
    perks.push("Recon");
  }
  else if (amountOfS >= 3) {
    perks.push("Strategist");
  }

  return perks;
}

app.set('view engine', 'ejs');

app.get("/", (request, response) => {
  response.render('pages/home');
});

app.get("/generateClass", (request, response) => {
  response.render("pages/generatedClassPage");
})

app.get("/getWeapons", (request, response) => {
  let primaries = {};
  let secondaries = {};
  let melees = {};

  let lethals = getEquipmentFromCSV("Weapon_data/Lethal_data.csv");
  let tacticals = getEquipmentFromCSV("Weapon_data/Tactical_data.csv");
  let fieldUpgrades = getEquipmentFromCSV("Weapon_data/FieldUpgrade_data.csv");

  let enforcerPerks = getEquipmentFromCSV("Weapon_data/EnforcerPerk_data.csv");
  let reconPerks = getEquipmentFromCSV("Weapon_data/ReconPerk_data.csv");
  let strategistPerks = getEquipmentFromCSV("Weapon_data/SpecialistPerk_data.csv");
  let firstPerk = getEquipmentFromCSV("Weapon_data/FirstPerk_data.csv");
  let secondPerk = getEquipmentFromCSV("Weapon_data/SecondPerk_data.csv");
  let thirdPerk = getEquipmentFromCSV("Weapon_data/ThirdPerk_data.csv");

  let wildcards = getEquipmentFromCSV("Weapon_data/Wildcard_data.csv");

  let scorestreaks = getEquipmentFromCSV("Weapon_data/Scorestreak_data.csv");

  let primaryFiles = ["Weapon_data/AR_data.csv", "Weapon_data/SMG_data.csv", "Weapon_data/Shotgun_data.csv", "Weapon_data/LMG_data.csv", "Weapon_data/MarksmanRifle_data.csv", "Weapon_data/SniperRifle_data.csv"];
  let secondaryFiles = ["Weapon_data/Pistol_data.csv", "Weapon_data/Launcher_data.csv"];
  primaryFiles.forEach((file) => {
    Object.assign(primaries, getWeaponsFromCSV(file));
  })
  secondaryFiles.forEach((file) => {
    Object.assign(secondaries, getWeaponsFromCSV(file));
  })

  Object.assign(melees, getWeaponsFromCSV("Weapon_data/Melee_data.csv"));

  let curLevel = getCookies(request, 'curLevel');
  if (curLevel == "") {
    curLevel = 1;
  }

  let randomPrimary = getRandomItemsFromJSON({...primaries}, curLevel);
  let randomSecondary = getRandomItemsFromJSON({...secondaries}, curLevel);
  let randomMelee = getRandomItemsFromJSON({...melees}, curLevel);

  let randomWildcard = Object.keys(getRandomItemsFromJSON({...wildcards}, curLevel))[0];

  let amountOfLethals = (randomWildcard == "Danger Close") ? 2: 1;
  let randomLethal = getRandomItemsFromJSON({...lethals}, curLevel);
  randomLethal = [Object.keys(randomLethal)[0]];
  if (amountOfLethals == 2) {
    randomLethal = [...randomLethal, ...randomLethal];
  }

  let amountOfTacticals = (randomWildcard == "Tactical Expert") ? 3: 1;
  let randomTactical = getRandomItemsFromJSON({...tacticals}, curLevel);
  randomTactical = [Object.keys(randomTactical)[0]];
  if (amountOfTacticals == 3) {
    randomTactical = [...randomTactical, ...randomTactical, ...randomTactical];
  }

  let amountOfPerks = (randomWildcard == "Perk Greed") ? 4: 3;
  let randomPerks = [Object.keys(getRandomItemsFromJSON({...firstPerk}, curLevel))[0], Object.keys(getRandomItemsFromJSON({...secondPerk}, curLevel))[0], Object.keys(getRandomItemsFromJSON({...thirdPerk}, curLevel))[0]];
  if (amountOfPerks == 4) {
    let leftPerks = {...firstPerk, ...secondPerk, ...thirdPerk};
    for (const perk in randomPerks) {
      delete leftPerks[randomPerks[perk]];
    }
    randomPerks = [...randomPerks, Object.keys(getRandomItemsFromJSON({...leftPerks}, curLevel))[0]];
  }
  randomPerks = addSpecialPerk(randomPerks, enforcerPerks, reconPerks, strategistPerks);

  let amountOfStreaks = (randomWildcard == "High Roller") ? 4: 3;
  let randomScorestreaks = [];
  for (let i = 0; i < amountOfStreaks; i++) {
    let newScorestreaks = {...scorestreaks};
    for (const key in randomScorestreaks) {
      if (Object.keys(newScorestreaks).includes(randomScorestreaks[key])) {
        delete newScorestreaks[randomScorestreaks[key]];
      }
    }
    randomScorestreaks = [...randomScorestreaks, Object.keys(getRandomItemsFromJSON({...newScorestreaks}, curLevel))[0]];
  }
  randomScorestreaks.sort((a, b) => Object.keys(scorestreaks).indexOf(a) - Object.keys(scorestreaks).indexOf(b));

  let amountOfFieldUpgrades = (randomWildcard == "Prepper") ? 2: 1;
  let randomFieldUpgrades = [Object.keys(getRandomItemsFromJSON({...fieldUpgrades}, curLevel))[0]];
  if (amountOfFieldUpgrades == 2) {
    randomFieldUpgrades = [...randomFieldUpgrades, Object.keys(getRandomItemsFromJSON({...fieldUpgrades}, curLevel))[0]];
  }

  let amountOfAttachments = (randomWildcard == "Gunfighter") ? 8: 5;
  randomPrimary = getRandomAttachments({...randomPrimary}, amountOfAttachments);

  if (randomWildcard == "Overkill") {
    delete primaries[Object.keys(randomPrimary)[0]];
    randomSecondary = getRandomItemsFromJSON({...primaries}, curLevel);
  }

  randomSecondary = getRandomAttachments({...randomSecondary}, 5);

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