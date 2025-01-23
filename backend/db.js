const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/inotebook";

const connectToMongo = () => {
    mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log('connected to mongoose successfully');
        })
        .catch((err) => {
            console.error('Error connecting to mongoose:', err);
        });
}

module.exports = connectToMongo;