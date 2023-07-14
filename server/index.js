import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import adminRoutes from "./routes/admin.js";
import ConversationRoute from "./routes/ConversationRoute.js";
import MessageRoute from "./routes/MessageRoute.js";
import NotificationRoute from "./routes/NotificationRoute.js"


// import User from "./models/User.js";
// import Post from "./models/Post.js";
// import { users , posts } from "./data/index.js";

// CONFIGURATION

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy:"cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb" , extended :  true}));
app.use(bodyParser.urlencoded({ limit :"30mb" , extended : true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname,'public/assets')));


// FiLE STORAGE



// ROUTES WITH FILES


// ROUTES WITHOUT FILES
app.use("/auth",authRoutes);
app.use("/users",userRoutes);
app.use("/posts",postRoutes);
app.use("/admin",adminRoutes);
app.use('/conversations', ConversationRoute)
app.use('/messages', MessageRoute);
app.use('/notifications', NotificationRoute)

// mongoose


const PORT = process.env.PORT || 6001;

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    }).then(()=>{
        app.listen(PORT,()=>console.log(`Server Port : ${PORT}`));
    }).catch((error)=> console.log(`${error} did not connect`));