module.exports = class event {
    
    constructor(time, price, eventType){
        this.time = time;
        this.price = price;
        this.eventType = eventType;
        
        console.log(eventType + " event occurred at " + time + " and it costed " + price);
    }
};