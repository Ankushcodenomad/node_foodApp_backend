const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        console.log("urll db==>",process.env.MONGO_URL)
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`Connected to data base ${mongoose.connection.host}`);
    } catch (error) {
        console.error('Connection error:', error);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDb;
