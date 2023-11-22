function openModal() {
    var modal = document.getElementById("cookiePolicyModal");
    var contentContainer = document.getElementById("cookiePolicyContent");

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            contentContainer.innerHTML = xhr.responseText;
            modal.style.display = "block";
        }
    };
    xhr.open("GET", "cookie-policy.html", true);
    xhr.send();
}

function closeModal() {
    document.getElementById("cookiePolicyModal").style.display = "none";
}

function acceptCookies() {
    // Aquí va el código para manejar la aceptación de cookies
    document.getElementById('cookieConsentPopup').style.display = 'none';
}

function rejectCookies() {
    // Aquí va el código para manejar el rechazo de cookies
    document.getElementById('cookieConsentPopup').style.display = 'none';
}