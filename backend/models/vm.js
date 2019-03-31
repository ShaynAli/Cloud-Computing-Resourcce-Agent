var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var event = require('../classes/event');

var VMSchema = new Schema({
    CC_ID: String,
    vmConfig: String,
    vmStatus: String,
    event: Array,  //holds the event class
    totalCharges: String,
    totalUsage: String
}); 

var VM = mongoose.model('VM', VMSchema);
module.exports = VM;