var current_vm;

function init() {

    var form = document.getElementById("vm-config-form");

    document.getElementById("start-vm").addEventListener("click", function() {
        start_vm(current_vm);
    });

    document.getElementById("stop-vm").addEventListener("click", function() {
        stop_vm(current_vm);
    });

    document.getElementById("delete-vm").addEventListener("click", function() {
        delete_vm(current_vm);
    });

    document.getElementById("stop-vm").addEventListener("click", function() {
        stop_vm(current_vm);
    });

    document.getElementById("upgrade-vm").addEventListener("click", function() {
        upgrade_vm(current_vm);
    });

    document.getElementById("downgrade-vm").addEventListener("click", function() {
        downgrade_vm(current_vm);
    });

    document.getElementById("select-vm1").addEventListener("click", function() {
        select_vm(current_vm);
    });
}

// TODO: Make requests

function new_vm() {  
    console.log("creating vm");
    post("/createVM");
}

function select_vm(id) { 
    console.log("selecting vm " + id);
    document.getElementById("vm-config").style.visibility = "visible";
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
    method = method || "post";
    
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}
