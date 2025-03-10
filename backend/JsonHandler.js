export class JsonHandler {
    
    JsonHandler() {
        
    }

    filterItems(JsonObject, curLevel, includeDLC) {
        for (const key in JsonObject) {
            if ((JsonObject[key]['Level'] > curLevel) || (JsonObject[key]['Level'] == 0 && !includeDLC)) {
                delete JsonObject[key];
            }
            else {
                delete JsonObject[key]['Level'];
            }
        }
    }
  
    getRandomItemsFromJSON(JsonObject, curLevel, includeDLC) {
        if (Object.keys(JsonObject).length == 0) {
            return {};
        }
    
        this.filterItems(JsonObject, curLevel, includeDLC);
    
        let randomEntry = Object.entries(JsonObject)[Math.floor(Math.random()*Object.keys(JsonObject).length)];
    
        let randomKey = randomEntry[0];
        let randomJson = {};
        randomJson[randomKey] = randomEntry[1];
    
        return randomJson;
    }
  
    getRandomAttachments(weaponJson, amount) {
        let weaponName = Object.keys(weaponJson)[0];
        let attachments = weaponJson[weaponName];

        if (!attachments) {
            return weaponJson;
        }

        for (const key in attachments) {
            let randomAttachment = attachments[key][Math.floor(Math.random()*attachments[key].length)];
            attachments[key] = randomAttachment;
        }
        
        let nonEmptyKeys = Object.keys(attachments).filter(key => attachments[key] !== "");
    
        let attachmentsToRemove = Math.max(0, Object.keys(attachments).length - amount);
    
        for (let i = 0; i < attachmentsToRemove; i++) {
            let randomIndex = Math.floor(Math.random() * nonEmptyKeys.length);
            let randomKey = nonEmptyKeys[randomIndex];
        
            delete attachments[randomKey];
        
            nonEmptyKeys.splice(randomIndex, 1);
        }
    
        return weaponJson;
    }
  
  
    addSpecialPerk(perks, enforcer, recon, specialist) {
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
}