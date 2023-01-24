const mongoose = require('mongoose');

// Databse connection
const DB = process.env.DATABASE;
mongoose.set('strictQuery', false)
mongoose.connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,

}).then(() => {
    console.log('connection sucessful');
}).catch((err) => {
    console.log(err);
})
