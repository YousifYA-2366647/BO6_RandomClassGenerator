function getPicturePath(weaponName, attachmentType, attachmentName) {
    fullPath = "Resources/" + weaponName; 
    if (attachmentType != null) {
        fullPath += "/" + attachmentType 
    }
    if (attachmentName != null) {
        if (attachmentName == "") {
            return -1;
        }
        noSymbolsAttachmentName = attachmentName.replace(/\W/g, '');
        fullPath += "/" + noSymbolsAttachmentName;
    }
    if (attachmentName == null && attachmentType == null) {
        noSymbolWeaponName = weaponName.replace(/\W/g, '');
        fullPath += "/" + noSymbolWeaponName;
    }
    return fullPath + ".png";
}

function setupPrimary(jsonObject) {
    let primaryAttachements = document.getElementById("primaryAttachments");
    primaryAttachements.innerHTML = '';
    document.getElementById("primaryName").innerText = Object.keys(jsonObject)[0];
    document.getElementById("primaryImage").src = getPicturePath(Object.keys(jsonObject)[0], null, null);

    let chosenAttachements = Object.values(jsonObject)[0];
    for (const key in chosenAttachements) {
        let image = document.createElement('img');
        image.className = "attachement";
        ImagePath = getPicturePath(Object.keys(jsonObject)[0], key, chosenAttachements[key]);
        if (ImagePath == -1) {
            let division = document.createElement('div');
            division.className = "attachement";
            primaryAttachements.appendChild(division);
            continue;
        }
        image.src = ImagePath;

        primaryAttachements.appendChild(image);
    }
}

function setupSecondary(jsonObject) {
    let secondaryAttachements = document.getElementById("secondaryAttachments");
    secondaryAttachements.innerHTML = '';
    document.getElementById("secondaryName").innerText = Object.keys(jsonObject)[0];
    document.getElementById("secondaryImage").src = getPicturePath(Object.keys(jsonObject)[0], null, null);

    let chosenAttachementsSecondary = Object.values(jsonObject)[0];
    for (const key in chosenAttachementsSecondary) {
        let image = document.createElement('img');
        image.className = "attachement";
        ImagePath = getPicturePath(Object.keys(jsonObject)[0], key, chosenAttachementsSecondary[key]);
        if (ImagePath == -1) {
            let division = document.createElement('div');
            division.className = "attachement";
            secondaryAttachements.appendChild(division);
            continue;
        }
        image.src = ImagePath;

        secondaryAttachements.appendChild(image);
    }
}

function setupEquipment(lethalJsonObject, tacticalJsonObject, fieldJsonObject) {
    let lethalDiv = document.getElementById("randomLethal");
    let tacticalDiv = document.getElementById("randomTactical");
    let fieldDiv = document.getElementById("randomFieldUpgrade");
    lethalDiv.innerHTML = '';
    tacticalDiv.innerHTML = '';
    fieldDiv.innerHTML = '';

    for (const key in lethalJsonObject) {
        let paragraph = document.createElement('p');
        paragraph.className = "equipment";
        paragraph.innerText = lethalJsonObject[key];

        lethalDiv.appendChild(paragraph);
    }

    for (const key in tacticalJsonObject) {
        let paragraph = document.createElement('p');
        paragraph.className = "equipment";
        paragraph.innerText = tacticalJsonObject[key];

        tacticalDiv.appendChild(paragraph);
    }

    for (const key in fieldJsonObject) {
        let paragraph = document.createElement('p');
        paragraph.className = "equipment";
        paragraph.innerText = fieldJsonObject[key];

        fieldDiv.appendChild(paragraph);
    }
}

function setupPerks(perkJsonObject) {
    let perkDiv = document.getElementById("randomPerks");
    perkDiv.innerHTML = '';

    for (const key in perkJsonObject) {
        let paragraph = document.createElement('p');
        paragraph.className = "perk";
        paragraph.innerText = perkJsonObject[key];

        perkDiv.appendChild(paragraph);
    }
}

function setupWildcard(wildcard) {
    let wildcardText = document.getElementById("randomWildcardText");
    wildcardText.innerText = wildcard;
}

function setupScorestreaks(scorestreakJsonObject) {
    let scorestreakDiv = document.getElementById("randomScorestreaks");
    scorestreakDiv.innerHTML = '';

    for (const key in scorestreakJsonObject) {
        let paragraph = document.createElement('p');
        paragraph.className = "scorestreak";
        paragraph.innerText = scorestreakJsonObject[key];

        scorestreakDiv.appendChild(paragraph);
    }
}

function getRandomWeapons() {
    fetch("/getWeapons", {
        method: "GET"
    })
    .then((res) => {
        if (res.status != 200) {
            console.error("error occurred");
        }
        return res.json();
    })
    .then(res => {
        console.log(JSON.stringify(res));

        setupPrimary(res.primary);

        setupSecondary(res.secondary);

        document.getElementById("meleeName").innerText = Object.keys(res.melee)[0];
        document.getElementById("meleeImage").src = getPicturePath(Object.keys(res.melee)[0], null, null);

        setupEquipment(res.lethal, res.tactical, res.fieldUpgrade);

        setupPerks(res.perks);

        setupWildcard(res.wildcard);

        setupScorestreaks(res.scorestreaks);
    })
}

window.onload = getRandomWeapons();

document.getElementById("regenerateButton").addEventListener('click', getRandomWeapons);