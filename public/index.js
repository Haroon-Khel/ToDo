// Vanilla javascript for index.html
function Ajaxrequest(type, url) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("response").innerHTML = this.responseText;
        }
    };
    xhttp.open(type, url, true);
    xhttp.send();
}