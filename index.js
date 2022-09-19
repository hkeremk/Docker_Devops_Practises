const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const redis = require("redis");
let RedisStore = require("connect-redis")(session)

const { 
   MONGO_USER,
   MONGO_PASSWORD, 
   MONGO_IP, 
   MONGO_PORT,
   REDIS_URL,
   SESSION_SECRET,
   REDIS_PORT,
} = require("./config/config");

let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT,
});


// const postRouter = require("./routes/postRoutes");
// const userRouter = require("./routes/userRoutes")

const app = express();

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?
authSource=admin`;

const connctWithRetry = () => {
    mongoose
   .connect(mongoURL, {
       useNewUrlParser: true,
       useUnifiedTopology: true, 
       
   })
   .then(() => console.log("Successful connection to the database."))
   .catch((e) => {
     console.log(e);
     setTimeout(connctWithRetry, 5000);
   });
};

connctWithRetry();

// app.use(session({
//     store: new RedisStore({client: redisClient}),
//     secret: SESSION_SECRET,
//     cookie: {
//         secure: false,
//         resave: false,
//         saveUninitialized: false,
//         httpOnly: true,
//         maxAge: 60000
//     }
// }));

// app.use(express.json());
// app.use(express.urlencoded({
//     extended: true,
// }));

app.get("/", (req,res) => {
    res.send("<h2>Wilkommen König</h2>");
});

// app.use("/api/v1/posts", postRouter); 
// app.use("/api/v1/users", userRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server is listening on port ${port}..`));