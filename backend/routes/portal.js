// portal.js
const bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
var vm = require('../models/vm');
var Event = require('../classes/event.js');
var nodeMailer = require('nodemailer');
var fs = require('fs');


var password = 'cloudcomp123!';


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

router.route('/getAllVM')
    .get(function(req, res) {
        vm.find(function(err, VMs) {
            if (err){
                res.send(err);
                console.log(err);
            } else {
                res.json({vms: VMs});
            }
        });
    });

router.route('/createVM')
    .post(function(req, res) {
        // Initalize new VM for the user
        console.log(req); //logging request for debugging reasons
        
        var data = new vm();
        data.CC_ID = "1";
        data.vmConfig = "basic";
        data.vmStatus = "stopped";
        data.event = [];
        data.totalCharges = "0";
        data.totalUsage = "0";
        
        data.save(function(err, newVM){
            if(err){
                console.log(err);       //handling errror
                throw err;
            }else {
                console.log("New VM with ID " + newVM._id + "has been created!");
                res.json({VM: newVM._id});  // Creates new VM and sends its ID to client
            }
        });
        
    });

router.route('/startVM/:_id')
    .post(function(req, res) {
        // Start running the selected vm
        
        vm.findById(req.params._id, function(err, VM) {
            if(err) {
                res.send(err);
            }else {
                var vmBeforeUpdate = new vm();
                vmBeforeUpdate._id = VM._id;
			    vmBeforeUpdate.CC_ID = VM.CC_ID;
			    vmBeforeUpdate.vmConfig = VM.vmConfig;
			    vmBeforeUpdate.vmStatus = VM.vmStatus;
			    vmBeforeUpdate.event = VM.event;
			    vmBeforeUpdate.totalCharges = VM.totalCharges;
			    vmBeforeUpdate.totalUsage = VM.totalUsage;
			    
                var updatedVM = eventOccurred(vmBeforeUpdate, "start");
                
                VM._id = updatedVM._id;
			    VM.CC_ID = updatedVM.CC_ID;
			    VM.vmConfig = updatedVM.vmConfig;
			    VM.vmStatus = updatedVM.vmStatus;
			    VM.event = updatedVM.event;
			    VM.totalCharges = updatedVM.totalCharges;
			    VM.totalUsage = updatedVM.totalUsage;
                
                VM.save(function(err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("VM "+VM._id+" has been started!");
                        res.json({vm: VM.vmStatus});
                    }
                });
            }
        });
    });
    
router.route('/stopVM/:_id')
    .post(function(req, res) {
        
        vm.findById(req.params._id , function(err, VM) {
            if (err) {
                res.send(err);
            }else {
                
                var vmBeforeUpdate = new vm();
                vmBeforeUpdate._id = VM._id;
			    vmBeforeUpdate.CC_ID = VM.CC_ID;
			    vmBeforeUpdate.vmConfig = VM.vmConfig;
			    vmBeforeUpdate.vmStatus = VM.vmStatus;
			    vmBeforeUpdate.event = VM.event;
			    vmBeforeUpdate.totalCharges = VM.totalCharges;
			    vmBeforeUpdate.totalUsage = VM.totalUsage;
			    
			    var updatedVM = eventOccurred(vmBeforeUpdate,"stop");
			    
			    VM._id = updatedVM._id;
			    VM.CC_ID = updatedVM.CC_ID;
			    VM.vmConfig = updatedVM.vmConfig;
			    VM.vmStatus = updatedVM.vmStatus;
			    VM.event = updatedVM.event;
			    VM.totalCharges = updatedVM.totalCharges;
			    VM.totalUsage = updatedVM.totalUsage;
                
                VM.save(function(err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("VM "+VM._id+" has been stopped!");
                        res.json({vm: VM.vmStatus, VMTotalCharge: VM.totalCharges, VMTotalUsage: VM.totalUsage});
                    }
                });
                
            }
        });
    });
    
router.route('/currentCharges/:_id')

    .post(function(req, res){
        vm.findById(req.params._id, function(err, VM) {
            
            if(err){
                console.log(err);
                throw err;
            } else {
                
                var vmBeforeUpdate = new vm();
			    vmBeforeUpdate._id = VM._id;
			    vmBeforeUpdate.CC_ID = VM.CC_ID;
			    vmBeforeUpdate.vmConfig = VM.vmConfig;
			    vmBeforeUpdate.vmStatus = VM.vmStatus;
			    vmBeforeUpdate.event = VM.event;
			    vmBeforeUpdate.totalCharges = VM.totalCharges;
			    vmBeforeUpdate.totalUsage = VM.totalUsage;
			    console.log(vmBeforeUpdate._id +" is requesting its current total charges...");
			    
			    var currentTotalCharges = updateTotalCharges(vmBeforeUpdate);
			    
			    VM.totalCharges = currentTotalCharges.toString();
			    
			    
			    VM.save(function(err){
			        
			        if(err){
			            console.log(err);
			            throw err;
			        } else {
			            res.json({currentTotalCharges: VM.totalCharges});
			        }
			        
			    });
                
            }
            
        });
    });
    
    
router.route('/upgradeVM/:_id')
    
    .post(function(req, res){
        
      vm.findById(req.params._id, function(err, VM) {

			if (err){
				console.log(err);
			} else {
			    
			    var vmBeforeUpdate = new vm();
			    vmBeforeUpdate._id = VM._id;
			    vmBeforeUpdate.CC_ID = VM.CC_ID;
			    vmBeforeUpdate.vmConfig = VM.vmConfig;
			    vmBeforeUpdate.vmStatus = VM.vmStatus;
			    vmBeforeUpdate.event = VM.event;
			    vmBeforeUpdate.totalCharges = VM.totalCharges;
			    vmBeforeUpdate.totalUsage = VM.totalUsage;
			    console.log(vmBeforeUpdate.vmStatus+" Status before upgrade")
			    
			    var updatedVM = eventOccurred(vmBeforeUpdate,"upgrade");
			    
			    VM._id = updatedVM._id;
			    VM.CC_ID = updatedVM.CC_ID;
			    VM.vmConfig = updatedVM.vmConfig;
			    VM.vmStatus = updatedVM.vmStatus;
			    VM.event = updatedVM.event;
			    VM.totalCharges = updatedVM.totalCharges;
			    VM.totalUsage = updatedVM.totalUsage;
			    console.log(updatedVM.vmStatus+" Status after upgrade")
			    
			    
    			VM.save(function(err) {
    				if (err){
    					console.log(err);
    					throw err;
    				}
                    else{
    				    res.json({VMConfig: VM.vmConfig});
                    }
    			});
    			
            }
        
		});
        
    });
    
router.route('/downgradeVM/:_id')

    .post(function(req, res){
        vm.findById(req.params._id, function(err, VM) {
            if (err) {
                res.send(err);
            }else {
                
                var vmBeforeUpdate = new vm();
                vmBeforeUpdate._id = VM._id
			    vmBeforeUpdate.CC_ID = VM.CC_ID;
			    vmBeforeUpdate.vmConfig = VM.vmConfig;
			    vmBeforeUpdate.vmStatus = VM.vmStatus;
			    vmBeforeUpdate.event = VM.event;
			    vmBeforeUpdate.totalCharges = VM.totalCharges;
			    vmBeforeUpdate.totalUsage = VM.totalUsage;
			    
			    var updatedVM = eventOccurred(vmBeforeUpdate,"downgrade");
			    
			    VM._id = updatedVM._id;
			    VM.CC_ID = updatedVM.CC_ID;
			    VM.vmConfig = updatedVM.vmConfig;
			    VM.vmStatus = updatedVM.vmStatus;
			    VM.event = updatedVM.event;
			    VM.totalCharges = updatedVM.totalCharges;
			    VM.totalUsage = updatedVM.totalUsage;
                
                VM.save(function(err) {
                    if(err) {
                        console.log(err);
                        throw err;
                    }
                    else {
                        res.json({VMConfig: VM.vmConfig});
                    }
                });
            }
        });
    });
    
    function calculateTimeUsage(vm){
        var eventArraySize = vm.event.length;
        if (eventArraySize == 0) {
            return 0;
        }
        if (vm.event.eventArraySize != "stop") {
        var timeOfLastEvent = parseInt(vm.event[eventArraySize - 1].time);
        }else {
            var timeOfLastEvent = parseInt(Date.now());
        }
        var timeOfFirstEvent = parseInt(vm.event[0].time);
        
        return (timeOfLastEvent - timeOfFirstEvent + 0.5)/60000; //returns the time elapsed in minutes
    }
    
    function eventOccurred(vm, desiredStatus){
        //each case/condition in this function would record the current time and find the difference between
        //current time and last time
        // a new event object would be created (with the current time and new status) and added to the event array
        
        logEntry(desiredStatus);
        
        var price = " ";
        var time = Date.now().toString();
      //  console.log(vm.vmStatus);
        switch(vm.vmStatus){
            case "stopped":
                if (vm.event.length == 0 && desiredStatus == "start") {
                    vm.vmStatus = "started";
                    price = "0.05";
                    var eventToAdd = new Event(time, price, desiredStatus);
                    vm.event.push(eventToAdd);
                }
                break;
                
            case "started":
                vm.totalCharges = updateTotalCharges(vm);
                if(desiredStatus == "upgrade"){
                    if(vm.vmConfig == "basic"){
                        vm.vmConfig = "large";
                        price = "0.10";
                    } else if(vm.vmConfig == "large"){
                        vm.vmConfig = "ultra-large";
                        price = "0.15";
                    }
               // console.log(vm.vmConfig);
                
                } else if(desiredStatus == "downgrade"){
                    
                    if(vm.vmConfig == "ultra-large"){
                        vm.vmConfig = "large";
                        price = "0.10";
                    } else if(vm.vmConfig == "large"){
                        vm.vmConfig = "basic";
                        price = "0.05"
                    }
                    
                } else if(desiredStatus == "stop"){
                    vm.vmStatus = "stopped";
                    price = "0";
                    vm.totalUsage = calculateTimeUsage(vm);
                }
                
                var eventToAdd = new Event(time, price, desiredStatus);
                vm.event.push(eventToAdd);
                
                break;
            
        }
        
        return vm;
    }
    
    function logEntry(eventType){
        
        var data = eventType + " has occurred";
        
        fs.appendFile("cloudLogFile.txt", data, function(err, data) {
            
        if (err) {
            console.log(err);
            throw err;
        }
            console.log("Successfully Written to File.");
        });
        
    }
    
    
    function updateTotalCharges(vm) {
        var currentTotalCharges = parseFloat(vm.totalCharges)
        var timeNow = parseInt(Date.now());
        var lastEvent = vm.event[vm.event.length-1];
        var timeSinceLastEvent = (timeNow - parseInt(lastEvent.time))/60000;
        var price = parseFloat(lastEvent.price);
        
        var totalChargeSinceLastEvent = price * timeSinceLastEvent;
        var totalCharges = (currentTotalCharges + totalChargeSinceLastEvent).toFixed(2);
        
        return totalCharges;
    }

// Need to export at end of file
module.exports = router;
