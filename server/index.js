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
import { Server } from "socket.io";

// CONFIGURATION

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/admin", adminRoutes);
app.use("/conversations", ConversationRoute);
app.use("/messages", MessageRoute);

// mongoose

const PORT = process.env.PORT || 6001;

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const server = app.listen(PORT, () => console.log(`Server Port : ${PORT}`));
    const io = new Server(server, { cors: true });
    let users = [];

    const addUser = (userId, socketId) => {
      console.log("new User");
      !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
    };

    const removeUser = (socketId) => {
      users = users.filter((user) => user.socketId !== socketId);
    };

    const getUser = (userId) => {
      try {
        console.log(users, "Array-users");
        return users.find((user) => user.userId === userId);
      } catch (error) {
        console.log(error);
      }
    };

    io.on("connection", (socket) => {
      console.log("a user connected.");

      //take userId and socketId from user

      socket.on("addUser", ({ userId }) => {
        addUser(userId, socket.id);
        console.log(userId, "ID");
        console.log(users, "array");
        io.emit("getUsers", users);
      });

      //send and get message
      socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        try {
          console.log(receiverId, "receiver");
          console.log(senderId, "sender");
          const user = getUser(receiverId);
          console.log(user, "message send");
          socket.to(user?.socketId).emit("getMessage", {
            senderId,
            text,
            createdAt: Date.now(),
          });
        } catch (error) {
          console.log("user not available");
          console.log(error, "SA");
        }
      });
      socket.on("newMessage", (message) => {
        // Update the unread count for the conversation
        setUnreadCount(unreadCount + 1);
      });

      //notifications

      socket.on("sendNotification", ({ senderId, type, userId }) => {
        console.log("emitted", userId);
        const receiver = getUser(userId);
        console.log(userId, receiver);
        socket.to(receiver?.socketId).emit("getNotification", {
          emiterId: senderId,
          text: type,
          createdAt: Date.now(),
        });
      });

      socket.on("sendText", ({ senderName, receiverName, text }) => {
        const receiver = getUser(receiverName);
        io.to(receiver?.socketId).emit("getText", {
          senderName,
          text,
        });
      });

      //when disconnect
      socket.on("disconnect", () => {
        console.log("a user disconnected!");
        removeUser(socket.id);
        io.emit("getUsers", users);
      });
    });
  })
  .catch((error) => console.log(`${error} did not connect`));
