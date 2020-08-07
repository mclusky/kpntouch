const mongoose = require('mongoose');

// mongoose.connect("mongodb+srv://taskapp:Store*_*49@cluster0-bkulv.mongodb.net/kit??retryWrites=true", {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false
//   })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.log(err));

mongoose.connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));