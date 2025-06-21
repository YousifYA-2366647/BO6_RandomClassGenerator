// returns the path to the requested image of a weapon or an attachment of that weapon.
function getWeaponImagePath(weaponName, attachmentType, attachmentName) {
    fullPath = "resources/Weapons/" + weaponName; 
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

// returns the path to the requested image of a perk.
function getPerkImagePath(perkName) {
    let fullPath = "resources/Perks/";
    let noSymbolsPerkName = perkName.replace(/\W/g, '');
    return fullPath + noSymbolsPerkName + ".png";
}

// returns the path to the requested image of a scorestreak.
function getScorestreakImagePath(scorestreakName) {
    let fullPath = "resources/Scorestreaks/";
    let noSymbolsScorestreakName = scorestreakName.replace(/\W/g, '');
    return fullPath + noSymbolsScorestreakName + ".png";
}

// returns the path to the requested image of a wildcard.
function getWildcardImagePath(wildcardName) {
    let fullPath = "resources/Wildcards/";
    let noSymbolsWildcardName = wildcardName.replace(/\W/g, '');
    return fullPath + noSymbolsWildcardName + ".png";
}

// returns the path to the requested image of an equipment.
function getEquipmentImagePath(equipmentName) {
    let fullPath = "resources/Equipment/";
    let noSymbolsEquipmentName = equipmentName.replace(/\W/g, '');
    return fullPath + noSymbolsEquipmentName + ".png";
}

// creates the image and text for the primary weapon.
// also creates the image and text for the attachments modal of the primary weapon.
function setupPrimary(jsonObject) {
    let primaryAttachements = document.getElementById("primaryAttachments");
    document.getElementById("primaryAttachmentsAmount").innerHTML = '';
    primaryAttachements.innerHTML = '';
    document.getElementById("primaryName").innerText = Object.keys(jsonObject)[0];
    document.getElementById("primaryImage").src = getWeaponImagePath(Object.keys(jsonObject)[0], null, null);


    let chosenAttachements = Object.values(jsonObject)[0];
    for (const key in chosenAttachements) {
        if (!chosenAttachements[key]) {
            document.getElementById("primaryAttachmentsAmount").innerHTML += "&#x25CB;"
        }
    }

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
        image.alt = chosenAttachements[key];

        primaryAttachements.appendChild(image);

        document.getElementById("primaryAttachmentsAmount").innerHTML += "&#x25CF;"
    }
    if (chosenAttachements.length > 5) {
        document.getElementById("primaryAttachmentModalContent").style.marginTop = (13 - chosenAttachements.length) + "%"
        document.getElementById("primaryAttachmentModalContent").style.height = (chosenAttachements.length * 11) + "%";
    }
}

// creates the image and text for the secondary weapon.
// also creates the image and text for the attachments modal of the secondary weapon.
function setupSecondary(jsonObject) {
    let secondaryAttachements = document.getElementById("secondaryAttachments");
    document.getElementById("secondaryAttachmentsAmount").innerHTML = '';
    secondaryAttachements.innerHTML = '';
    document.getElementById("secondaryName").innerText = Object.keys(jsonObject)[0];
    document.getElementById("secondaryImage").src = getWeaponImagePath(Object.keys(jsonObject)[0], null, null);

    let chosenAttachementsSecondary = Object.values(jsonObject)[0];
    for (const key in chosenAttachementsSecondary) {
        if (!chosenAttachementsSecondary[key]) {
            document.getElementById("secondaryAttachmentsAmount").innerHTML += "&#x25CB;"
        }
    }

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
        image.alt = chosenAttachementsSecondary[key];

        secondaryAttachements.appendChild(image);

        document.getElementById("secondaryAttachmentsAmount").innerHTML += "&#x25CF;"
    }
}

// creates the images and text of the equipment.
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
        image.alt = lethalJsonObject[key];

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
        image.alt = tacticalJsonObject[key];

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
        image.alt = fieldJsonObject[key];

        let paragraph = document.createElement('p');
        paragraph.className = "equipment";
        paragraph.innerText = fieldJsonObject[key];

        newFieldDiv.appendChild(image)
        newFieldDiv.appendChild(paragraph);

        fieldDiv.append(newFieldDiv);
    }

    if (Object.keys(lethalJsonObject).length > 1) {
        document.getElementById("lethalClassifier").innerText = "Lethals:";
    }
    else {
        document.getElementById("lethalClassifier").innerText = "Lethal:";
    }
    
    if (Object.keys(tacticalJsonObject).length > 1) {
        document.getElementById("tacticalClassifier").innerText = "Tacticals:";
    }
    else {
        document.getElementById("tacticalClassifier").innerText = "Tactical:";
    }
    
    if (Object.keys(fieldJsonObject).length > 1) {
        document.getElementById("fieldClassifier").innerText = "Field Upgrades:";
    }
    else {
        document.getElementById("fieldClassifier").innerText = "Field Upgrade:";
    }
}

// creates the images and text of the perks.
function setupPerks(perkJsonObject) {
    let index = 1;
    for (const key in perkJsonObject) {
        let perkDivision = document.getElementById("perk" + index);
        if (perkJsonObject[key] == "Enforcer" || perkJsonObject[key] == "Recon" || perkJsonObject[key] == "Strategist") {
            perkDivision = document.getElementById("Specialty");
        }

        perkDivision.innerHTML = '';
        document.getElementById("Specialty").innerHTML = '';
        if (index < 4) {
            document.getElementById("perk4").innerHTML = '';
        }

        let image = document.createElement('img');
        image.className = "perkImage";
        image.src = getPerkImagePath(perkJsonObject[key]);
        image.alt = perkJsonObject[key];

        let paragraph = document.createElement('p');
        paragraph.className = 'perk';
        paragraph.innerText = perkJsonObject[key];

        perkDivision.appendChild(image);
        perkDivision.appendChild(paragraph);

        index++;
    }
}

// creates the image and text of the wildcard.
function setupWildcard(wildcard) {
    let randomWildcard = document.getElementById("randomWildcard");
    randomWildcard.innerHTML = '';

    if (wildcard != '') {
        let wildcardImage = document.createElement('img');
        wildcardImage.className = "wildcardImage";
        wildcardImage.src = getWildcardImagePath(wildcard);
        wildcardImage.alt = wildcard;

        randomWildcard.appendChild(wildcardImage);
    }
    else {
        let emptyDiv = document.createElement('div');
        emptyDiv.className = "wildcardImage";
        
        randomWildcard.appendChild(emptyDiv);
    }

    let wildcardText = document.createElement('p');
    wildcardText.className = "wildcardText";
    wildcardText.innerText = wildcard;

    randomWildcard.appendChild(wildcardText);
}

// creates the images and text of the scorestreaks.
function setupScorestreaks(scorestreakJsonObject) {
    let scorestreakDiv = document.getElementById("randomScorestreaks");
    scorestreakDiv.innerHTML = '';

    for (const key in scorestreakJsonObject) {
        let newScorestreakDiv = document.createElement('div');
        newScorestreakDiv.className = 'scorestreakDiv';

        let image = document.createElement('img');
        image.className = "scorestreakImage";
        image.src = getScorestreakImagePath(scorestreakJsonObject[key]);
        image.alt = scorestreakJsonObject[key];

        let paragraph = document.createElement('p');
        paragraph.className = 'scorestreak';
        paragraph.innerText = scorestreakJsonObject[key];

        newScorestreakDiv.appendChild(image);
        newScorestreakDiv.appendChild(paragraph);

        scorestreakDiv.appendChild(newScorestreakDiv);
    }
}

// requests the random class and sets up the images and text to display it.
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

let timer = (new Date()).getTime();

// once the document is loaded, a random class should be requested.
document.addEventListener("DOMContentLoaded", function () {
    getRandomWeapons();
    timer = (new Date()).getTime();
});

// when the 'generate' button is pressed, a random class should be requested.
document.getElementById("regenerateButton").addEventListener('click', function () {
    if ((new Date()).getTime() - timer >= 1000) {
        getRandomWeapons();
        timer = (new Date()).getTime();
    }
    else {
        return;
    }
});

// code to make the attachments modals appear when the weapon image is clicked.
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

document.getElementById("homeButton").addEventListener('click', function() {
    window.location.href = "/";
})

window.onclick = function(event) {
    if (event.target === secondaryModal) {
        secondaryModal.style.display = "none";
        
        document.body.style.overflow = "auto";
    }
    else if (event.target === modal) {
        modal.style.display = "none";
        
        document.body.style.overflow = "auto";
    }
}