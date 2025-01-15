document.getElementById("generateButton").addEventListener('click', function() {
    document.cookie = "curLevel=" + document.getElementById("curLevel").value + "; path=/";
    window.location.href = "/generateClass";
})

document.getElementById("disclaimerButton").addEventListener('click', function() {
    window.location.href = "/disclaimer";
})

document.getElementById("curLevel").addEventListener('input', function() {
    document.getElementById("curLevelLabel").innerText = "Level: " + document.getElementById("curLevel").value;
})