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

        let primaryAttachements = document.getElementById("primaryAttachments");
        primaryAttachements.innerHTML = '';
        document.getElementById("primaryName").innerText = Object.keys(res.primary)[0];
        document.getElementById("primaryImage").src = getPicturePath(Object.keys(res.primary)[0], null, null);

        let chosenAttachements = Object.values(res.primary)[0];
        for (const key in chosenAttachements) {
            let image = document.createElement('img');
            image.className = "attachement";
            ImagePath = getPicturePath(Object.keys(res.primary)[0], key, chosenAttachements[key]);
            if (ImagePath == -1) {
                let division = document.createElement('div');
                division.className = "attachement";
                primaryAttachements.appendChild(division);
                continue;
            }
            image.src = ImagePath;

            primaryAttachements.appendChild(image);
        }

        let secondaryAttachements = document.getElementById("secondaryAttachments");
        secondaryAttachements.innerHTML = '';
        document.getElementById("secondaryName").innerText = Object.keys(res.secondary)[0];
        document.getElementById("secondaryImage").src = getPicturePath(Object.keys(res.secondary)[0], null, null);

        let chosenAttachementsSecondary = Object.values(res.secondary)[0];
        for (const key in chosenAttachementsSecondary) {
            let image = document.createElement('img');
            image.className = "attachement";
            ImagePath = getPicturePath(Object.keys(res.secondary)[0], key, chosenAttachementsSecondary[key]);
            if (ImagePath == -1) {
                let division = document.createElement('div');
                division.className = "attachement";
                secondaryAttachements.appendChild(division);
                continue;
            }
            image.src = ImagePath;

            secondaryAttachements.appendChild(image);
        }

        document.getElementById("meleeName").innerText = Object.keys(res.melee)[0];
        document.getElementById("meleeImage").src = getPicturePath(Object.keys(res.melee)[0], null, null);
    })
}

window.onload = getRandomWeapons();

document.getElementById("regenerateButton").addEventListener('click', getRandomWeapons);