const fs = require('fs');
const { parse } = require('csv-parse');
const express = require('express');

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
  let primaries = {};
  let secondaries = {};

  let curPrimary = "";
  let curSecondary = "";

  let primaryFiles = ["Weapon_data/AR_data.csv", "Weapon_data/SMG_data.csv", "Weapon_data/Shotgun_data.csv", "Weapon_data/LMG_data.csv", "Weapon_data/MarksmanRifle_data.csv", "Weapon_data/SniperRifle_data.csv"];
  let secondaryFiles = ["Weapon_data/Pistol_data.csv", "Weapon_data/Launcher_data.csv", "Weapon_data/Melee_data.csv", ];
  primaryFiles.forEach((file) => {
    const fileContent = fs.readFileSync(file, 'utf-8');
    fileContent.split("\n").forEach(line => {
      line = line.trim().replace(/\n/g, '')
      let records = line.split(";");
      if (records.length != 0) {
        if (records[0] == "Name") {
          primaries[records[1]] = {};
          curPrimary = records[1];
        }
        else {
          var randomAttachment = records.slice(1, records.length)[Math.floor(Math.random()*records.length)];
          primaries[curPrimary][records[0]] = randomAttachment;
        }
      }
    })
  })
  secondaryFiles.forEach((file) => {
    const fileContent = fs.readFileSync(file, 'utf-8');
    fileContent.split("\n").forEach(line => {
      line = line.trim().replace(/\n/g, '')
      let records = line.split(";");
      if (records.length != 0) {
        if (records[0] == "Name") {
          secondaries[records[1]] = {};
          curSecondary = records[1];
        }
        else {
          var randomAttachment = records.slice(1, records.length)[Math.floor(Math.random()*records.length)];
          secondaries[curSecondary][records[0]] = randomAttachment;
        }
      }
    })
  })

  let randomPrimary = Object.entries(primaries)[Math.floor(Math.random()*Object.keys(primaries).length)];
  let randomSecondary = Object.entries(secondaries)[Math.floor(Math.random()*Object.keys(secondaries).length)];

  let primaryKey = randomPrimary[0];
  let primaryJson = {};
  primaryJson[primaryKey] = randomPrimary[1];

  let secondaryKey = randomSecondary[0];
  let secondaryJson = {};
  secondaryJson[secondaryKey] = randomSecondary[1];

  response.status(200).json({primary: primaryJson, secondary: secondaryJson});
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