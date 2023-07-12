
const io = require("socket.io")(4000, {
  cors: {
    origin: [ "http://localhost:3001" , "http://localhost:3000"],  //,"http://localhost:5000"  "http://localhost:3000",
  },
});

  let users = [];
  
  const addUser = (userId, socketId) => {
    console.log("new User")
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
      
  };
  
  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };
  
  const getUser = (userId) => {
    try {
      console.log(users,"Array-users")
      return users.find((user) => user.userId === userId);
    } catch (error) {
      console.log(error)
    }
  };
  
  io.on("connection", (socket) => {
    console.log("a user connected.");
      
    //take userId and socketId from user
  
    socket.on("addUser", ({userId}) => {
      addUser(userId, socket.id);
      console.log(userId,"ID")
      console.log(users,"array");
      io.emit("getUsers", users);
    });
  
    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      try {
        console.log(receiverId, "receiver")
        console.log(senderId,"sender")
        const user = getUser(receiverId);
        console.log(user, "message send");
        socket.to(user?.socketId).emit("getMessage", {
          senderId,
          text,
          createdAt: Date.now()
        });
      } catch (error) {
        console.log("user not available");
        console.log(error,"SA")
      }
  
    });
    socket.on('newMessage', (message) => {
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
        createdAt: Date.now()
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