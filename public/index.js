
var machineId = document.querySelector('input[name="mid"]');
var error = document.getElementById('error');
error.style.display = "none";
var message = document.getElementById('message');
message.style.display = "none";

(async () => {
    await fetch('http://localhost:7071/cred', { method: "GET" }).then((response) => {
        if (response.status == 200) {
            return response.json();
        }
    }).then((data) => {

        showMessage('Load user data from system is success');
        machineId.value = data.id;
    }).catch((err) => {
        console.log(err);
        showError(err.toString());
    })
})()

const updateData = async (e) => {
    console.log(document.getElementById('exampleInputPassword').value);
    await fetch('http://localhost:7071/change-credentials', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "id": document.getElementById('exampleInputPassword').value,
        }),
    }).then((response) => {
        if (response.status == 201) return response.json();
        else {
            showError('Error ! ' + response.status + ' Something went wrong ')
        }
    }).then((data) => {
        showMessage('Id Updated');
    }).catch((err) => {
        showError(err.toString());
    })
}


function showError(message) {
    var node = document.createElement('p');
    var textnode = document.createTextNode(message);
    node.appendChild(textnode);
    error.appendChild(node);
    error.style.display = "flex";
    setTimeout(() => {
        error.removeChild(node);
        error.style.display = "none";
    }, 4000);
}

function showMessage(mes) {
    var node = document.createElement('p');
    var textnode = document.createTextNode(mes);
    node.appendChild(textnode);
    message.appendChild(node);
    message.style.display = "flex";
    setTimeout(() => {
        message.removeChild(node);
        message.style.display = "none";
    }, 4000);
}