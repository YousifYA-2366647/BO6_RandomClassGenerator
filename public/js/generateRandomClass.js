window.onload = function () {
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
        let primaryAttachements = document.getElementById("primaryAttachments");
        document.getElementById("primaryName").innerText = Object.keys(res.primary)[0];
        let chosenAttachements = Object.values(res.primary)[0];
        for (const key in chosenAttachements) {
            let paragraph = document.createElement('p');
            paragraph.className = "attachement";
            paragraph.innerText = key + ": " + chosenAttachements[key];

            primaryAttachements.appendChild(paragraph);
        }

        let secondaryAttachements = document.getElementById("secondaryAttachments");
        document.getElementById("secondaryName").innerText = Object.keys(res.secondary)[0];
        let chosenAttachementsSecondary = Object.values(res.secondary)[0];
        for (const key in chosenAttachementsSecondary) {
            let paragraph = document.createElement('p');
            paragraph.className = "attachement";
            paragraph.innerText = key + ": " + chosenAttachementsSecondary[key];

            secondaryAttachements.appendChild(paragraph);
        }
    })
}

