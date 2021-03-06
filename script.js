/**
 * Created by Emmanuelle on 26/02/2016.
 */
var findme = document.getElementById("input");
var divresults = document.getElementById("results");
var selection = -1;
var arraydiv = document.getElementsByClassName("choice");
var beforevalue;
var beforerequest;

function navigate(e) {
    var length = arraydiv.length;
    if (e.keyCode == 40 && length > 0) {
        if (selection > -1) {
            arraydiv[selection].id = "";
        }
        if (selection == length - 1) {
            selection = -1;
        }
        selection++;
        arraydiv[selection].id = "selected";
    }
    else if (e.keyCode == 38 && selection > -1) {
        arraydiv[selection].id = "";
        if (selection == 0) {
            selection = length;
        }
        selection--;
        arraydiv[selection].id = "selected";
    }
    else if (e.keyCode == 13 && selection > -1) {
        choosen(arraydiv[selection]);
    }
    else {
        if (beforerequest && beforerequest.readyState < XMLHttpRequest.DONE) {
            beforerequest.abort();
        }
        selection = -1;
        if (findme.value != 0 && findme.value != beforevalue) {
            gotophp();
        }
    }
}
function gotophp() {
    beforevalue = findme.value;
    divresults.innerHTML = "";
    var xml = new XMLHttpRequest();
    xml.addEventListener('readystatechange', function () {
            if (xml.readyState == 4) {
                if (xml.status === 200 || xml.status === 0) {
                    var phpback = xml.response;
                    if (phpback.length) {
                        var array_proposals = phpback.split("|");
                        for (var i = 0; i < array_proposals.length; i++) {
                            var div = document.createElement("div");
                            div.innerHTML = array_proposals[i];
                            div.className = "choice";
                            div.style.cursor = "pointer";
                            div.addEventListener("click", choosen, true);
                            divresults.appendChild(div);
                        }
                    }
                    else {
                        divresults.innerHTML = "Aucune ville ne correspond à cette recherche";
                    }
                } else {
                    alert('error code :' + xml.status + ':' + xml.statusText)
                }
            }
        }
    );
    xml.open("POST", 'villes.php', true);
    xml.setRequestHeader("content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    xml.send("findme=" + findme.value);
    return xml;
}

/*Fin de gotophp*/

function choosen(div) {
    findme.value = div.innerHTML;
    divresults.innerHTML = "";
}

findme.addEventListener("keyup", navigate, true);