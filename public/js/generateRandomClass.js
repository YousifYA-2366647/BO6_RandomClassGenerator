function getWeaponImagePath(weaponName, attachmentType, attachmentName) {
    fullPath = "Resources/Weapons/" + weaponName; 
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

function getPerkImagePath(perkName) {
    let fullPath = "Resources/Perks/";
    let noSymbolsPerkName = perkName.replace(/\W/g, '');
    return fullPath + noSymbolsPerkName + ".png";
}

function getScorestreakImagePath(scorestreakName) {
    let fullPath = "Resources/Scorestreaks/";
    let noSymbolsScorestreakName = scorestreakName.replace(/\W/g, '');
    return fullPath + noSymbolsScorestreakName + ".png";
}

function getWildcardImagePath(wildcardName) {
    let fullPath = "Resources/Wildcards/";
    let noSymbolsWildcardName = wildcardName.replace(/\W/g, '');
    return fullPath + noSymbolsWildcardName + ".png";
}

function getEquipmentImagePath(equipmentName) {
    let fullPath = "Resources/Equipment/";
    let noSymbolsEquipmentName = equipmentName.replace(/\W/g, '');
    return fullPath + noSymbolsEquipmentName + ".png";
}

function setupPrimary(jsonObject) {
    let primaryAttachements = document.getElementById("primaryAttachments");
    primaryAttachements.innerHTML = '';
    document.getElementById("primaryName").innerText = Object.keys(jsonObject)[0];
    document.getElementById("primaryImage").src = getWeaponImagePath(Object.keys(jsonObject)[0], null, null);

    let chosenAttachements = Object.values(jsonObject)[0];
    for (const key in chosenAttachements) {
        if (!chosenAttachements[key]) {
            continue;
        }
        let image = document.createElement('img');
        image.className = "attachement";
        ImagePath = getWeaponImagePath(Object.keys(jsonObject)[0], key, chosenAttachements[key]);
        if (ImagePath == -1) {
            let division = document.createElement('div');
            division.className = "attachement";
            primaryAttachements.appendChild(division);
            continue;
        }
        image.src = ImagePath;

        primaryAttachements.appendChild(image);
    }
    if (chosenAttachements.length > 5) {
        document.getElementById("primaryAttachmentModalContent").style.marginTop = (13 - chosenAttachements.length) + "%"
        document.getElementById("primaryAttachmentModalContent").style.height = (chosenAttachements.length * 11) + "%";
    }
}

function setupSecondary(jsonObject) {
    let secondaryAttachements = document.getElementById("secondaryAttachments");
    secondaryAttachements.innerHTML = '';
    document.getElementById("secondaryName").innerText = Object.keys(jsonObject)[0];
    document.getElementById("secondaryImage").src = getWeaponImagePath(Object.keys(jsonObject)[0], null, null);

    let chosenAttachementsSecondary = Object.values(jsonObject)[0];
    for (const key in chosenAttachementsSecondary) {
        if (!chosenAttachementsSecondary[key]) {
            continue;
        }
        let image = document.createElement('img');
        image.className = "attachement";
        ImagePath = getWeaponImagePath(Object.keys(jsonObject)[0], key, chosenAttachementsSecondary[key]);
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
        let grenadeDiv = document.createElement('div');
        grenadeDiv.className = 'grenadeDiv';

        let image = document.createElement('img');
        image.className = 'grenadeImage';
        image.src = getEquipmentImagePath(lethalJsonObject[key]);

        let paragraph = document.createElement('p');
        paragraph.className = "equipment";
        paragraph.innerText = lethalJsonObject[key];

        grenadeDiv.appendChild(image)
        grenadeDiv.appendChild(paragraph);

        lethalDiv.append(grenadeDiv);
    }

    for (const key in tacticalJsonObject) {
        let grenadeDiv = document.createElement('div');
        grenadeDiv.className = 'grenadeDiv';

        let image = document.createElement('img');
        image.className = 'grenadeImage';
        image.src = getEquipmentImagePath(tacticalJsonObject[key]);

        let paragraph = document.createElement('p');
        paragraph.className = "equipment";
        paragraph.innerText = tacticalJsonObject[key];

        grenadeDiv.appendChild(image)
        grenadeDiv.appendChild(paragraph);

        tacticalDiv.append(grenadeDiv);
    }

    for (const key in fieldJsonObject) {
        let newFieldDiv = document.createElement('div');
        newFieldDiv.className = 'fieldDiv';

        let image = document.createElement('img');
        image.className = 'fieldImage';
        image.src = getEquipmentImagePath(fieldJsonObject[key]);

        let paragraph = document.createElement('p');
        paragraph.className = "equipment";
        paragraph.innerText = fieldJsonObject[key];

        newFieldDiv.appendChild(image)
        newFieldDiv.appendChild(paragraph);

        fieldDiv.append(newFieldDiv);
    }
}

function setupPerks(perkJsonObject) {
    let perkDiv = document.getElementById("randomPerks");
    perkDiv.innerHTML = '';

    for (const key in perkJsonObject) {
        let newPerkDiv = document.createElement('div');
        newPerkDiv.className = 'perkDiv';

        let image = document.createElement('img');
        image.className = "perkImage";
        image.src = getPerkImagePath(perkJsonObject[key]);

        let paragraph = document.createElement('p');
        paragraph.className = 'perk';
        paragraph.innerText = perkJsonObject[key];

        newPerkDiv.appendChild(image);
        newPerkDiv.appendChild(paragraph);

        perkDiv.appendChild(newPerkDiv);
    }
}

function setupWildcard(wildcard) {
    let randomWildcard = document.getElementById("randomWildcard");
    randomWildcard.innerHTML = '';

    let wildcardImage = document.createElement('img');
    wildcardImage.className = "wildcardImage";
    wildcardImage.src = getWildcardImagePath(wildcard);

    let wildcardText = document.createElement('p');
    wildcardText.className = "wildcardText";
    wildcardText.innerText = wildcard;

    randomWildcard.appendChild(wildcardImage);
    randomWildcard.appendChild(wildcardText);
}

function setupScorestreaks(scorestreakJsonObject) {
    let scorestreakDiv = document.getElementById("randomScorestreaks");
    scorestreakDiv.innerHTML = '';

    for (const key in scorestreakJsonObject) {
        let newScorestreakDiv = document.createElement('div');
        newScorestreakDiv.className = 'scorestreakDiv';

        let image = document.createElement('img');
        image.className = "scorestreakImage";
        image.src = getScorestreakImagePath(scorestreakJsonObject[key]);

        let paragraph = document.createElement('p');
        paragraph.className = 'scorestreak';
        paragraph.innerText = scorestreakJsonObject[key];

        newScorestreakDiv.appendChild(image);
        newScorestreakDiv.appendChild(paragraph);

        scorestreakDiv.appendChild(newScorestreakDiv);
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
        document.getElementById("meleeImage").src = getWeaponImagePath(Object.keys(res.melee)[0], null, null);

        setupEquipment(res.lethal, res.tactical, res.fieldUpgrade);

        setupPerks(res.perks);

        setupWildcard(res.wildcard);

        setupScorestreaks(res.scorestreaks);
    })
}

window.onload = getRandomWeapons();

document.getElementById("regenerateButton").addEventListener('click', getRandomWeapons);

var modal = document.getElementById("primaryAttachmentModal");
var button = document.getElementById("primaryAttachmentButton");
var closeButton = document.getElementById("closeButton");

button.onclick = function(event) {
    event.preventDefault();
    modal.style.display = "block";

    document.body.style.overflow = "hidden";
}

closeButton.onclick = function() {
    modal.style.display = "none";

    document.body.style.overflow = "auto";
}

window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
        
        document.body.style.overflow = "auto";
    }
}

var secondaryModal = document.getElementById("secondaryAttachmentModal");
var secondaryButton = document.getElementById("secondaryAttachmentButton");
var secondaryCloseButton = document.getElementById("secondCloseButton");

secondaryButton.onclick = function(event) {
    event.preventDefault();
    secondaryModal.style.display = "block";

    document.body.style.overflow = "hidden";
}

secondaryCloseButton.onclick = function() {
    secondaryModal.style.display = "none";

    document.body.style.overflow = "auto";
}

window.onclick = function(event) {
    if (event.target === secondaryModal) {
        secondaryModal.style.display = "none";
        
        document.body.style.overflow = "auto";
    }
}