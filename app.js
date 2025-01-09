const fs = require('fs');
const { parse } = require('csv-parse');
const express = require('express');

const app = express();
const APP_PORT = 8080;

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
  equipment = [];

  const fileContent = fs.readFileSync(fileName, 'utf-8');
  fileContent.split("\n").forEach(line => {
    line = line.trim().replace(/\n/g, '')
    let records = line.split(";");
    if (records.length != 0) {
      if (records[0] == "Name") {
        equipment.push(records[1]);
      }
    }
  })

  return equipment;
}

function getRandomItemsFromJSON(JsonObject) {
  let randomEntry = Object.entries(JsonObject)[Math.floor(Math.random()*Object.keys(JsonObject).length)];

  let randomKey = randomEntry[0];
  let randomJson = {};
  randomJson[randomKey] = randomEntry[1];

  return randomJson;
}

function getRandomWildcard(arrayObject) {
  let randomEntry = arrayObject[Math.floor(Math.random()*arrayObject.length)];

  return randomEntry;
}

function getRandomElements(arrayObject, amount) {
  let chosenItems = [];

  for (let i = 0; i < amount; i++) {
    let randomObject = arrayObject[Math.floor(Math.random()*arrayObject.length)];
    chosenItems.push(randomObject);
    arrayObject.splice(arrayObject.indexOf(randomObject), 1);
  }

  return chosenItems;
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
    if (enforcer.indexOf(perks[perk]) != -1) {
      amountOfE++;
    }
    else if (recon.indexOf(perks[perk]) != -1) {
      amountOfR++;
    }
    else if (specialist.indexOf(perks[perk]) != -1) {
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

  let randomPrimary = getRandomItemsFromJSON(primaries);
  let randomSecondary = getRandomItemsFromJSON(secondaries);
  let randomMelee = getRandomItemsFromJSON(melees);

  console.log(JSON.stringify(randomPrimary));

  let randomWildcard = getRandomWildcard(wildcards);

  let amountOfLethals = (randomWildcard == "Danger Close") ? 2: 1;
  let randomLethal = getRandomElements([...lethals], 1);
  if (amountOfLethals == 2) {
    randomLethal = [...randomLethal, ...randomLethal];
  }

  let amountOfTacticals = (randomWildcard == "Tactical Expert") ? 3: 1;
  let randomTactical = getRandomElements([...tacticals], 1);
  if (amountOfTacticals == 3) {
    randomTactical = [...randomTactical, ...randomTactical, ...randomTactical];
  }

  let amountOfPerks = (randomWildcard == "Perk Greed") ? 4: 3;
  let randomPerks = [...getRandomElements(firstPerk, 1), ...getRandomElements(secondPerk, 1), ...getRandomElements(thirdPerk, 1)];
  if (amountOfPerks == 4) {
    let leftPerks = [...firstPerk, ...secondPerk, ...thirdPerk];
    for (const perk in randomPerks) {
      leftPerks.splice(leftPerks.indexOf(randomPerks[perk]), 1);
    }
    randomPerks = [...randomPerks, ...getRandomElements([...leftPerks], 1)];
  }
  randomPerks = addSpecialPerk(randomPerks, enforcerPerks, reconPerks, strategistPerks);

  let amountOfStreaks = (randomWildcard == "High Roller") ? 4: 3;
  let randomScorestreaks = getRandomElements([...scorestreaks], amountOfStreaks);
  randomScorestreaks.sort((a, b) => scorestreaks.indexOf(a) - scorestreaks.indexOf(b));

  let amountOfFieldUpgrades = (randomWildcard == "Prepper") ? 2: 1;
  let randomFieldUpgrades = getRandomElements([...fieldUpgrades], amountOfFieldUpgrades);

  let amountOfAttachments = (randomWildcard == "Gunfighter") ? 8: 5;
  randomPrimary = getRandomAttachments({...randomPrimary}, amountOfAttachments);

  if (randomWildcard == "Overkill") {
    randomSecondary = getRandomItemsFromJSON(primaries);
  }

  randomSecondary = getRandomAttachments({...randomSecondary}, 5);

  console.log(JSON.stringify(randomPrimary));

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