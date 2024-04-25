require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const passport = require('passport');
const {schedulerService} = require('./utils/SchedulerService');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));

//DB config
mongoose.connect(`mongodb+srv://asrigyan:${process.env.MONGO_PW}@cluster1.uluohgb.mongodb.net/kharcha?retryWrites=true&w=majority`, {useNewUrlParser:true, useUnifiedTopology: true, useFindAndModify: false},
()=> console.log("DB connected"));
schedulerService.init();

const diaryRoutes = require('./routes/diaries');
const itemsRoutes = require('./routes/items');
const taskRoutes  = require('./routes/tasks');
const authRoutes = require('./routes/auth');
const oauthRoutes = require("./middlewares/oAuth");
const notificationRoutes = require('./routes/notification');
const errorHandler = require('./errorHandler');
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());

app.use(cors({origin: ["https://moneytrack-nine.vercel.app",'https://newsapi.org'], credentials: true}));
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.get("/", (req,res) => res.send("Hi"));
app.use('/', authRoutes);
app.use("/users", diaryRoutes);
app.use("/users", itemsRoutes.router);
app.use("/users", taskRoutes);
app.use("/auth/google", oauthRoutes);
app.use("/users", notificationRoutes);
app.use(errorHandler);

