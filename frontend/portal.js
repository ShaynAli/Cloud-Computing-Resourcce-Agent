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
}

// TODO: Make requests

function new_vm() {  
    post('/createVM');
}

function select_vm(id) {  }

function start_vm(id) {  }

function stop_vm(id) { 
    // TODO: Get requests
 }

function delete_vm(id) {  }

function upgrade_vm(id) {  }

function downgrade_vm(id) {  }

function update_vm_price(id) {  }

function update_vm_total_price(id) {  }

function post(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
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