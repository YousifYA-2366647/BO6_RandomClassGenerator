// JsonHandler will be responsible for chosing random objects from Json objects.
export class JsonHandler {
    
    JsonHandler() {
        
    }

    // filterItems is used to apply the settings the user chose on the Json objects.
    // if the user's level is lower than any object in the Json, then it will be removed.
    // if the user excluded DLC weapons, then they won't be added. DLC weapons are marked in the json files by a 'Level: 0'.
    filterItems(JsonObject, curLevel, includeDLC) {
        let filteredJson = {};

        for (const key in JsonObject) {
            const level = parseInt(JsonObject[key]['Level'], 10);

            if ((level > curLevel) || (level === 0 && !includeDLC)) {
                continue;
            }

            let newEntry = { ...JsonObject[key] };
            delete newEntry.Level;

            filteredJson[key] = newEntry;
        }

        return filteredJson;
    }
  
    // getRandomItemsFromJSON filters the given Json object and returns a random entry from it.
    getRandomItemsFromJSON(JsonObject, curLevel, includeDLC) {
        if (Object.keys(JsonObject).length == 0) {
            return {};
        }
    
        let filteredJson = this.filterItems(JsonObject, curLevel, includeDLC);
    
        let randomEntry = Object.entries(filteredJson)[Math.floor(Math.random()*Object.keys(filteredJson).length)];
    
        let randomKey = randomEntry[0];
        let randomJson = {};
        randomJson[randomKey] = randomEntry[1];
    
        return randomJson;
    }
  
    // getRandomAttachments gets a Json object that represents a weapon, and choses random attachments for it.
    // the amount of attachments chosen is equal to the parameter 'amount'.
    // once enough attachments have been chosen, this function will make all other attachments empty.
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
  
    // addSpecialPerk adds a specialty perk to the class.
    // this specialty perk is given if the class has at least three perks of the same color.
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