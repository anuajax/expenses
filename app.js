require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const passport = require('passport');
const {schedulerService} = require('./utils/SchedulerService');
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));

//DB config

mongoose.connect('mongodb://localhost:27017/expenses?retryWrites=false', {useNewUrlParser:true, useUnifiedTopology: true, useFindAndModify: false},
()=> console.log("DB connected"));
schedulerService.init();

const diaryRoutes = require('./routes/diaries');
const itemsRoutes = require('./routes/items');
const taskRoutes  = require('./routes/tasks');
const authRoutes = require('./routes/auth');
const oauthRoutes = require("./middlewares/oAuth");
const errorHandler = require('./errorHandler');
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.get("/", (req,res) => res.send("Hi"));
app.use('/', authRoutes);
app.use("/users", diaryRoutes);
app.use("/users", itemsRoutes.router);
app.use("/users", taskRoutes);
app.use("/auth/google", oauthRoutes);
app.use(errorHandler);

