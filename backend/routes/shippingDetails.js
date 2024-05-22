const express = require('express');
const router = express.Router();
const

    dotenv = require('dotenv');
const ShippingDetail = require('../model/shippingDetails');
const RatesShedule = require('../model/ratesSchedule');
dotenv.config();

router.post('/shippingDetails', async (req, res) => {
    try {

        const newShippingDetail = new ShippingDetail(req.body);
        const savedShippingDetail = await newShippingDetail.save();
        res.status(201).json(savedShippingDetail);
    } catch (error) {

        res.status(400).json({ message: error.message });
    }
});


router.get('/rates', async (req, res) => {
    try {
        const { fromAddress, toAddress, date, containerType, shippingLines, container } = req.query;
        console.log(req.query);

        let query = {
            POL: { $regex: new RegExp(fromAddress, 'i') },
            POD: { $regex: new RegExp(toAddress, 'i') },
            ContainerType: containerType,
            OceanFreight: container
        };
        
        // If shippingLines is not empty, add filter on ShippingLine field
        if (shippingLines && shippingLines.length > 0) {
            // const shippingLinesArray = Array.isArray(shippingLines) ? shippingLines : [shippingLines];
            query.Carrier = { $in: shippingLines };
        }
        

        const allData = await RatesShedule.find(query);
        console.log(allData)
        if (allData.length === 0) {
            return res.status(204).json({ status: 204, message: "There is no Location" });
        }
        else {
            // console.log(allData);
            const filteredData = allData.filter(item => {
                const fromDate = new Date(item.ValidFrom);
                const toDate = new Date(item.ValidTo);

                return new Date(date) >= fromDate && new Date(date) <= toDate;
            });

            if (filteredData.length === 0) {
                return res.status(204).json({ status: 204, message: "No data found matching the provided criteria" });
            }

            return res.status(200).json({ status: 200, data: filteredData });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/schedule', async (req, res) => {
    try {
        const { fromAddress, toAddress, date, containerType, shippingLines } = req.query;
        console.log(req.query);

        let query = {
            POL: { $regex: new RegExp(fromAddress, 'i') },
            POD: { $regex: new RegExp(toAddress, 'i') },
            ContainerType: containerType
        };

        // If shippingLines is not empty, add filter on ShippingLine field
        if (shippingLines && shippingLines.length > 0) {
            query.Carrier = { $in: shippingLines };
        }
        console.log(query)
        const allData = await RatesShedule.find(query);
        console.log(allData);

        if (allData.length === 0) {
            return res.status(204).json({ status: 204, message: "There is no Location" });
        } else {
            const filteredData = allData.filter(item => {
                const fromDate = new Date(item.ValidFrom);
                const toDate = new Date(item.ValidTo);

                return  new Date(date) <= toDate;
            });
            console.log(filteredData)
            if (filteredData.length === 0) {
                return res.status(204).json({ status: 204, message: "No data found matching the provided criteria" });
            } else {
                return res.status(200).json({ status: 200, data: filteredData });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



module.exports = router;