// downloaded package require
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as dotenv from "dotenv";

const app = express();

// initialise downlaoded package
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

dotenv.config();

const PORT = process.env.PORT || 5000;

if (!process.env.MONGODB_URI) {
    console.warn("MONGODB_URI is not set. Please copy server/.env.example to server/.env and set MONGODB_URI.");
}
if (!process.env.JWT_SECRET) {
    console.warn("JWT_SECRET is not set. Please copy server/.env.example to server/.env and set JWT_SECRET.");
}
// user defined package
import connectDB from "./utils/connectDB.js";
// import User from "./models/User.js";
import authRoute from "./routes/authRoute.js";
import planRoute from "./routes/planCategoryRoute.js";
import subscriptionRoute from "./routes/subscriptionRoute.js";
import ContactRoute from "./routes/contactRoute.js";
import feedBackRoute from "./routes/feedBackRoute.js";
import nutritionRoute from "./routes/nutritionRoute.js";
import workoutRoute from "./routes/workoutRoute.js";
import dietPlanRoute from "./routes/dietPlanRoute.js";

app.get("/", (req, res) =>{
res.send("server is running successfully");
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/plan", planRoute);
app.use("/api/v1/subscription", subscriptionRoute);
app.use("/api/v1/contact", ContactRoute);
app.use("/api/v1/feedback", feedBackRoute);
app.use("/api/v1/nutrition", nutritionRoute);
app.use("/api/v1/workout", workoutRoute);
app.use("/api/v1/diet", dietPlanRoute);


const startServer = async () => {
    try{
        // Wait for DB connection to succeed before starting the server
        await connectDB(process.env.MONGODB_URI);
        app.listen(PORT, () => {
         console.log(`server is running on port ${PORT}`);
        });        
    }

    catch(err){
        console.error("Failed to start server:", err?.message || err || "some error in starting server");
        process.exit(1);
    }
}

startServer();

// Handle unexpected errors and rejections to assist debugging
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});








