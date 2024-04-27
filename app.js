require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const passport = require('passport');
const {schedulerService} = require("./utils/SchedulerService");
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));

//DB config
mongoose.connect(`mongodb+srv://anuajax:${process.env.MONGOPW}@cluster1.j1pcs3e.mongodb.net/expenses?retryWrites=true&w=majority&appName=Cluster1`, {useNewUrlParser:true, useUnifiedTopology: true, useFindAndModify: false, connectTimeoutMS: 30000,socketTimeoutMS: 45000},
()=> console.log("DB connected"));
schedulerService.init();

const diaryRoutes = require('./routes/diaries');
const itemsRoutes = require('./routes/items');
const taskRoutes  = require('./routes/tasks');
const authRoutes = require('./routes/auth');
const oauthRoutes = require("./middlewares/oAuth");
const notificationRoutes = require('./routes/notification');
const errorHandler = require('./errorHandler');
const axios = require("axios");
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

app.get('/api/news', async (req, res) => {
    try {
      const apiKey = 'b511741219fe4f9284ff6bb5f9874e97';
      const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${apiKey}`);
      console.log(response.data.articles);
      res.status(200).json(response.articles);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching news' });
    }
  });