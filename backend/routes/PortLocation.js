const express = require('express');
const router = express.Router();
const PortLocation = require('../model/portLocationModel'); 

router.get('/portLocationData', async (req, res) => {
    try {
        let { city, country } = req.query;
 
        city = city ? new RegExp(city.trim(), 'i') : null;
        country = country ? new RegExp(country.trim(), 'i') : null;
 
        // console.log("Data received - City:", city, "Country:", country);
 
        const query = {};
 
        if (city || country) {
            query.$or = [];
            if (city) {
                query.$or.push({ city: city });
            }
            if (country) {
                query.$or.push({ country: country });
            }
        }
 
        // console.log("Querying database with query:", query);
 
        const result = await PortLocation.find(query);
        // console.log("Filtered data:", result);
 
        if (result.length === 0) {
            return res.status(404).json({ error: 'Data not found for the provided criteria' });
        }
 
        res.json({ data: result.map(location => ({ country: location.country, city: location.city })), count: result.length });
 
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});





module.exports = router;