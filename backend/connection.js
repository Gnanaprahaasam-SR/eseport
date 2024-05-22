const mongoose = require('mongoose');

const connectDB = () => {
    mongoose.connect(process.env.MONGODB_URL)

        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch(error => {
            console.error('Error connecting to MongoDB:', error);
            process.exit(1);
        });
};

module.exports = connectDB;