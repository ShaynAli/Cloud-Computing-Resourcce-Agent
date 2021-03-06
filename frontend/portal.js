var current_vm = -1;
var vm_table, vm_list, vm_config;
var new_vm_button, start_vm_button, stop_vm_button, delete_vm_button, upgrade_vm_button, downgrade_vm_button;
var vms = {};
var vm_min_cost = 5;
var vm_max_cost = 15;

function init() {

    vm_table = document.getElementById("vm-table");
    vm_list = document.getElementById("vm-list");
    vm_config = document.getElementById("vm-config");

    total_usage = document.getElementById("total-vm-usage");

    new_vm_button = document.getElementById("new-vm");
    start_vm_button = document.getElementById("start-vm");
    stop_vm_button = document.getElementById("stop-vm");
    delete_vm_button = document.getElementById("delete-vm");
    upgrade_vm_button = document.getElementById("upgrade-vm");
    downgrade_vm_button = document.getElementById("downgrade-vm");

    vm_config.style.visibility = "hidden";

    new_vm_button.addEventListener("click", function(event) {
        new_vm();
    }, false);
    start_vm_button.addEventListener("click", function(event) {
        let id = current_vm;
        start_vm(id);
    }, false);
    stop_vm_button.addEventListener("click", function(event) {
        let id = current_vm;
        stop_vm(id);
    }, false);
    delete_vm_button.addEventListener("click", function(event) {
        let id = current_vm;
        delete_vm(id);
    }, false);
    upgrade_vm_button.addEventListener("click", function(event) {
        let id = current_vm;
        upgrade_vm(id);
    }, false);
    downgrade_vm_button.addEventListener("click", function(event) {
        let id = current_vm;
        downgrade_vm(id);
    }, false);

    setInterval(update_vm_prices, 1000);
}

function string_to_html(html_string) {
    var template = document.createElement("template");
    template.innerHTML = html_string.trim();
    return template.content.cloneNode(true);
}

function new_vm() {
    let id = parseInt(Math.random() * 10000);
    post("/createVM").then(function(response) {
        id = response["VM"];
        return response;
    })
    console.log("creating vm " + id);
    vms[id] = {
        id: id,
        running_cost: 0,
        cost: 0
    }
    vm_table.appendChild(string_to_html(`
        <tr id="vm-` + id + `">\n
            <td>` + id + `</td>\n
            <td></td>\n
            <td id="status-` + id + `">Stopped</td>\n
            <td id="config-` + id + `">Level 1</td>\n
            <td id="vm-` + id + `-usage">$0</td>\n
            <td>\n
                <button id="` + id + `">Select VM</button>\n
            </td>\n
        </tr>
    `));
    document.getElementById(id).addEventListener("click", function(event) {
        console.log(event.target.id);
        select_vm(parseInt(event.target.id));
    }, false)
}

function select_vm(id) {
    console.log("selecting vm " + id);
    vm_config.style.visibility = "visible";
    current_vm = id;
 }

function start_vm(id) {
    console.log("starting vm " + id);
    post("/startVM/" + id);
    document.getElementById("status-" + id).innerHTML = "Started";
    document.getElementById("stop-vm").disabled = false;
    vms[id].cost = vm_min_cost;
}

function stop_vm(id) {
    console.log("stopping vm " + id);
    document.getElementById("status-" + id).innerHTML = "Stopped";
    document.getElementById("start-vm").disabled = true;
    post("/stopVM/" + id);
    vms[id].cost = 0;
 }

function delete_vm(id) {
    console.log("deleting vm " + id);
    stop_vm(id);
    document.getElementById("vm-" + id).remove();
    current_vm = -1;
    vm_config.style.visibility = "hidden";
}

function upgrade_vm(id) {
    console.log("upgrading vm " + id);

    if (vms[id].cost === 0) {
        return;
    }

    let level = document.getElementById("config-" + id).innerHTML;
    
    if (level === "Level 1") {
        document.getElementById("config-" + id).innerHTML = "Level 2";
    }

    if (level === "Level 2") {
        document.getElementById("config-" + id).innerHTML = "Level 3";
    }

    post("/upgradeVM/" + id);
    vms[id].cost = Math.min(vms[id].cost + 5, vm_max_cost);
}

function downgrade_vm(id) {
    console.log("downgrading vm " + id);

    let level = document.getElementById("config-" + id).innerHTML;

    if (level === "Level 3") {
        document.getElementById("config-" + id).innerHTML = "Level 2";
    }

    if (level === "Level 2") {
        document.getElementById("config-" + id).innerHTML = "Level 1";
    }

    post("/downgradeVM/" + id);
    vms[id].cost = Math.max(vms[id].cost - 5, vm_min_cost);
}

async function update_vm_prices() {
    console.log("updating vm prices");
    var total_cost = 0;
    for (const id in vms) {
        vm = vms[id];
        per_s_cost = vm.cost / 60.0;
        vm.running_cost += per_s_cost;
        total_cost += vm.running_cost;
        console.log(vm)
        try {
            document.getElementById("vm-" + id + "-usage").innerHTML = "$" + vm.running_cost;
        } catch (e) {
            // Ignore error (vm was deleted)
        }
    }
    total_usage.innerHTML = "TOTAL USAGE: $" + total_cost;
}

function post(path) {

    var url = "https://52.170.216.187:8080/portal" + path;

    return fetch(url, {
        method: "POST",
        headers: new Headers({
            "Accept": "application/json",
            "Content-Type": "application/json"
        }) 
    })
    .then(response => response.json());
}
