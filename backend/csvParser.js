import fs from "fs";
import { parse } from "csv-parse";

export class csvParser {

    csvParser() {

    }

    getWeaponsFromCSV(fileName) {
      let weapons = {};
      let curWeapon = "";
    
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
    
    getEquipmentFromCSV(fileName) {
      let equipment = {};
      let curEquipment = "";
    
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
}