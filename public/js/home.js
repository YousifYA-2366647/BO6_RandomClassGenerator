document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("generateButton").addEventListener('click', function() {
        document.cookie = "curLevel=" + document.getElementById("curLevel").value + "; path=/";
        document.cookie = "includeDLC=" + document.getElementById("includeDLC").checked + "; path=/";
        window.location.href = "/generateClass";
    })
    
    document.getElementById("disclaimerButton").addEventListener('click', function() {
        window.location.href = "/disclaimer";
    })
    
    document.getElementById("curLevel").addEventListener('input', function() {
        document.getElementById("curLevelLabel").innerText = "Level: " + document.getElementById("curLevel").value;
    })
    
    document.getElementById("includeDLC").checked = true;
})