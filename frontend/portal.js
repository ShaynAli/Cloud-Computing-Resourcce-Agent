var current_vm = -1;

function init() {

    var form = document.getElementById("vm-config-form");

    document.getElementById("new-vm").addEventListener("click", function() {
        new_vm();
    });

    document.getElementById("start-vm").addEventListener("click", function() {
        if (current_vm === -1) { 
            return;
        }
        start_vm(current_vm);
    });

    document.getElementById("stop-vm").addEventListener("click", function() {
        if (current_vm === -1) { 
            return;
        }
        stop_vm(current_vm);
    });

    document.getElementById("delete-vm").addEventListener("click", function() {
        if (current_vm === -1) { 
            return;
        }
        delete_vm(current_vm);
    });

    document.getElementById("stop-vm").addEventListener("click", function() {
        if (current_vm === -1) { 
            return;
        }
        stop_vm(current_vm);
    });

    document.getElementById("upgrade-vm").addEventListener("click", function() {
        if (current_vm === -1) { 
            return;
        }
        upgrade_vm(current_vm);
    });

    document.getElementById("downgrade-vm").addEventListener("click", function() {
        if (current_vm === -1) { 
            return;
        }
        downgrade_vm(current_vm);
    });

    document.getElementById("select-vm-1").addEventListener("click", function() {
        select_vm(1);
    });

    document.getElementById("select-vm-2").addEventListener("click", function() {
        select_vm(2);
    });
}

function new_vm() {  
    console.log("creating vm");
    post("/createVM");
}

function select_vm(id) { 
    console.log("selecting vm " + id);
    document.getElementById("vm-config").style.visibility = "visible";
    current_vm = id;
 }

function start_vm(id) {
    console.log("starting vm " + id);
    post("/startVM/" + id);
}

function stop_vm(id) {
    console.log("stopping vm" + id);
    post("/stopVM/" + id);
 }

function delete_vm(id) {
    console.log("deleting vm" + id);
    post("/deleteVM/" + id);
}

function upgrade_vm(id) {
    console.log("upgrading vm" + id);
    post("/upgradeVM/" + id);
}

function downgrade_vm(id) {
    console.log("downgrading vm" + id);
    post("/downgradeVM/" + id);
}

function update_vm_price(id) {
    console.log("updating price for vm " + id);
    // TODO
}

function update_vm_total_price() {
    console.log("downgrading total price");
    // TODO
}

function post(path, params, method) {

    var url = "https://cloud-computing-backend-gyoung52.c9users.io:8080/portal" + path;

    fetch(url, {
        method: "post",
        mode: "no-cors",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    })
    .then(function(response) {
        var json_out = response.json();
        console.log(JSON.stringify(json_out));
        return json_out;
    });
}
