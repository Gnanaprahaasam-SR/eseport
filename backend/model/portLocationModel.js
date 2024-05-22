const mongoose = require('mongoose');

const portLocationSchema = new mongoose.Schema({
    name: {
        type: String,        
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,       
    },
    alias: [String],
    regions: [String],
    coordinates: {
        type: [Number],       
    },
    province: String,
    timezone: String,
    unlocs: [String],
    code: String
}, { timestamps: true });


const PortLocation = mongoose.model('PortLocation', portLocationSchema);

module.exports = PortLocation;
