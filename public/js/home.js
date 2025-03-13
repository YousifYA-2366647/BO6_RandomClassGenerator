document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("generateButton").addEventListener('click', function() {
        document.cookie = "curLevel=" + document.getElementById("curLevel").value + "; path=/";
        document.cookie = "includeDLC=" + document.getElementById("includeDLC").checked + "; path=/";
        window.location.href = "/generateClass";
    })

    
    document.getElementById("includeDLC").addEventListener("change", function() {
        console.log(document.getElementById("includeDLC").checked);
    })
    
    document.getElementById("disclaimerButton").addEventListener('click', function() {
        window.location.href = "/disclaimer";
    })
    
    document.getElementById("curLevel").addEventListener('input', function() {
        document.getElementById("curLevelLabel").innerText = "Level: " + document.getElementById("curLevel").value;
    })

    document.getElementById("homeButton").addEventListener('click', function() {
        window.location.href = "/";
    })
    
    document.getElementById("includeDLC").checked = true;
})