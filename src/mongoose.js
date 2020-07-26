const mongoose = require('mongoose');

// set mongoose Promise to Bluebird
mongoose.Promise = Promise;

const mongoUri = `mongodb://localhost:${process.env.MONGO_PORT || 27017}/erc20Transfer`

// Exit application on error
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
    process.exit(-1);
});

exports.connect = () => {
    mongoose.connect(mongoUri, {
        keepAlive: 1,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    return mongoose.connection;
};
