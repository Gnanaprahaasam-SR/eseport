const mongoose = require("mongoose");
 
const RatesSheduleSchema = new mongoose.Schema({
    POL: {
        type: String,
        required:true      
    },
    POD: {
        type: String,
        required:true
    },
    Carrier: {
        type: String,
        required:true        
    },
    Service: {
        type: String,
        required:true        
    },
    OceanFreight: {
        type: String,
        required: true
    },
    OceanFreightPrice: {
        type: Number,
        required: true
    },
    ISPS_Price: {
        type: Number,
        required: true
    },
    ETD: {
        type: String,
        required:true        
    },
    Routing: {
        type: String,
        required:true        
    },
    Connectivity:{
        type: String,
        required:true
    },
    TravelTime:{
        type: String,
        required: true
    },
    FreeTime: {
        type: String,
        required: true
    },
    ValidFrom: {
        type: String,
        required:true
    },
    ValidTo: {
        type: String,
        required:true
    },
    ContainerType: {
        type: String,
        required:true
    },
    ContainerAvailability: {
        type: String,
        required:true
    }
 
},{ timestamps: true });
 
const RatesShedule = mongoose.model('RatesShedule', RatesSheduleSchema);
 
module.exports = RatesShedule;