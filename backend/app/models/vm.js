var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var event = require('../classes/event');

var VMSchema = new Schema({
    VM_ID: String,
    CC_ID: String,
    vmConfig: String,
    vmStatus: String,
    event: [event],  //holds the event class
    timeOfLastEvent: String,
    totalCharges: String,
    totalUsage: String
}); 

var VM = mongoose.model('VM', VMSchema);
module.exports = VM;