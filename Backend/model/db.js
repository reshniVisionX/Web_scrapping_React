const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const dbName = "WebScrap";
        const mongoUrl = `mongodb+srv://reshni:root@democlusterdb.4srqjmw.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=DemoClusterDB`;
        await mongoose.connect(mongoUrl);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1); 
    }
};
module.exports = connectDB;
