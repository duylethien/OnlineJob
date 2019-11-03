const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
//Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

dotenv.config();

//Connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () =>
    console.log("Database connected")
);
mongoose.set('useCreateIndex', true);
//   .connect('mongodb+srv://duylethien:123123123@cluster0-1b9kw.mongodb.net/duyy?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })

//Middleware
app.use(express.json());
//Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(3000, () => console.log('Server Up and running'));