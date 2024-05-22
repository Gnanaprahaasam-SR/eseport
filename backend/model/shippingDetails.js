const mongoose = require("mongoose");

const ShippingDetailSchema = new mongoose.Schema({
    POL: {
        type: String, 
        required:true       
    },
    POD: {
        type: String,
        required:true
    },
    Carriers: {
        type: String,
        required:true        
    },
    Services: {
        type: String,
        required:true        
    },
    OceanFreight_20GP: { type: Number, required:true },
    OceanFreight_40GP: { type: Number, required:true },
    OceanFreight_40HQ: { type: Number, required:true },
    OceanFreight_ISPS: {
        type: String, 
        required:true       
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
    TravelTime: {
        type: String,
        required:true
    },
    FreeTime: {
        type: Number,
        required:true
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
    }
}, { timestamps: true });

const ShippingDetail = mongoose.model('ShippingDetail', ShippingDetailSchema);

module.exports = ShippingDetail;
