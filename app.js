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
        var randomAttachment = records.slice(1, records.length)[Math.floor(Math.random()*records.length)];
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
  let attachments = Object.values(weaponJson)[0];
  let attachmentKeys = Object.keys(attachments);

  let iterateLength = attachmentKeys.length - amount;

  for (const key in attachments) {
    if (attachments[key] == "") {
      iterateLength--;
    }
  }

  for (let i = 0; i < iterateLength; i++) {
    let randomAttachmentKey = attachmentKeys[Math.floor(Math.random()*attachmentKeys.length)];
    weaponJson[weaponName][randomAttachmentKey] = "";
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
    perks.push("Specialist");
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
  let enforcerPerks = getEquipmentFromCSV("Weapon_data/EnforcerPerk_data.csv");
  let reconPerks = getEquipmentFromCSV("Weapon_data/ReconPerk_data.csv");
  let specialistPerks = getEquipmentFromCSV("Weapon_data/SpecialistPerk_data.csv");
  let wildcards = getEquipmentFromCSV("Weapon_data/Wildcard_data.csv");
  let scorestreaks = getEquipmentFromCSV("Weapon_data/Scorestreak_data.csv");
  let fieldUpgrades = getEquipmentFromCSV("Weapon_data/FieldUpgrade_data.csv");

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
  let randomPerks = getRandomElements([...enforcerPerks, ...reconPerks, ...specialistPerks], amountOfPerks);
  randomPerks = addSpecialPerk(randomPerks, enforcerPerks, reconPerks, specialistPerks);

  let amountOfStreaks = (randomWildcard == "High Roller") ? 4: 3;
  let randomScorestreaks = getRandomElements([...scorestreaks], amountOfStreaks);

  let amountOfFieldUpgrades = (randomWildcard == "Prepper") ? 2: 1;
  let randomFieldUpgrades = getRandomElements([...fieldUpgrades], amountOfFieldUpgrades);

  let amountOfAttachments = (randomWildcard == "Gunfighter") ? 8: 5;
  randomPrimary = getRandomAttachments({...randomPrimary}, amountOfAttachments);

  if (randomWildcard == "Overkill") {
    randomSecondary = getRandomItemsFromJSON(primaries);
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