// portal.js
const bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
var vm = require('../models/vm');
var Event = require('../classes/event.js');
const cors = require('cors');

// DATABASE SETUP
    var mongoose   = require('mongoose');
    mongoose.connect('mongodb://localhost:27017/vmData'); // connect to our database
    
    // Handle the connection event
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error: '));
    
    db.once('open', function() {
      console.log("DB connection alive");
    });

    router.use(function(request, response, next)
    {
        response.header("Access-Control-Allow-Origin", "*");
        response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        response.header('Access-Control-Allow-Methods', 'POST, PATCH, GET, PUT, DELETE, OPTIONS');
        next();
    });
    
    // the following 2 middleware convert the URL req and res to json format
    router.use(bodyParser.json({ limit: '20mb' }));
    router.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
    router.use(cors());
    
router.route('/createVM')
    .post(function(req, res) {
        // Initalize new VM for the user
    });

router.route('/startVM')
    .post(function(req, res) {
        // Start running the selected vm
        var data = new vm();

        data.userId = req.body.userId;
        data.config = "basic";
        data.status = "stopped";
        data.timeOfLastEvent = "";
        data.totalCharges = "0";
        data.totalUsage = "0";
        data.event = [];

    });
    
    // .get(function(req, res) {
    //     vm.get(req.query).then(function(response) {
    //         res.json({vm: response});
    //     }, function(err) {
    //         res.send(err);
    //     });
    // })
    
    // .put(function(req, res) {
    //     var updatedVM = req.body.updatedVM;
    //     vm.update(updatedVM).then(function(response) {
    //         res.json({vm: response});
    //     }, function(err) {
    //         res.send(err);
    //     });
    // });
    
router.route('/upgradeVM/:VM_ID')
    
    .put(function(req, res){
        
      //  var data = new vm();
        
    //    vm.find();
        
    });
    
router.route('/downgradeVM/:VM_ID')

    .put(function(req, res){
        
    });
    
    
    function createVM() {
        
    }
    
    
    function upgradeVM(vm){
        
        switch(vm.config){
            
            case "basic":
                vm.config = "large";
                break;
                
            case "large":
                vm.config = "ultra-large";
                break;
                
            default:
            
        }
        return vm;
    }
    
    function startVM(vm){
        
        vm.status = "running";
        var price = "";
        if (vm.config == "basic") {
            price = "0.05";
        }
        else if (vm.config == "large") {
            price = "0.10";
        }
        else {
            price = "0.15"
        }
        
        var event = new event(Date.now().toString(), price, "start");
        vm.event.push(event);
        //should probably implement something here that records this event (current time), need to make an event class or something
        //  similar
        
        return vm;
    }
    
    function stopVM(vm){
        
        vm.status = "stopped";
        //same as above
        
        return vm;
    }
    
    function eventOccurred(vm, desiredStatus){
        //each case/condition in this function would record the current time and find the difference between
        //current time and last time
        // a new event object would be created (with the current time and new status) and added to the event array
        
        var price = " ";
        var time = Date.now().toString();
        switch(vm.status){
            
            case "stopped":
                
                break;
                
            case "started":
                var lastEvent = vm.event
                if(desiredStatus == "upgrade"){
                    if(vm.config == "basic"){
                        vm.config = "large";
                        price = "0.10";
                    } else if(vm.config == "large"){
                        vm.config = "ultra-large";
                        price = "0.15";
                    }
                
                
                } else if(desiredStatus == "downgrade"){
                    
                    if(vm.config == "ultra-large"){
                        vm.config = "large";
                        price = "0.10";
                    } else if(vm.config == "large"){
                        vm.config = "basic";
                        price = "0.05"
                    }
                    
                } else if(desiredStatus == "stopped"){
                    
                }
                
                var eventToAdd = Event(time, price, desiredStatus);
                vm.event.push(eventToAdd);
                
                break;
            
        }
        
        return vm;
    }
    
    function downgradeVM(vm){
        
        switch(vm.config){
            
            case "large":
                break;
                
            case "ultra-large":
                break;
                
            default:
            
        }
        return vm;
        
    }

// Need to export at end of file
module.exports = router;