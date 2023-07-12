import "./Messenger.scss";
import '../../Style.scss'
import Navbar from '../navbar/index'
import Conversation from "../../components/Conversation/Conversation";
import Message from "../../components/Message/Message";
import { useContext, useEffect, useRef, useState } from "react";
import { Box } from "@mui/system";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { DarkmodeContext } from '../../Context/DarkmodeContext';
import axios from '../../utils/axios';
import InputEmoji from 'react-input-emoji'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {SocketContext} from '../../Context/socketContext';
import { useSelector } from "react-redux";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
}

export default function Messenger() {
  const { darkMode } = useContext(DarkmodeContext);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [err, setErr] = useState(false);
  const [reciever, setReciever] = useState(null);
  const [notCount, setNotCount] = useState(0);

  const currentUser = useSelector((state) => state.user);
  const scrollRef = useRef();
  const queryClient = new QueryClient();
  const socket = useContext(SocketContext);
  let subtitle;

  

  useEffect(() => {
    socket.emit("addUser", { userId: currentUser._id })
  }, [])


  useEffect(() => {
    socket.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);


  useEffect(() => {
    if (arrivalMessage) {
      if (!currentChat?.members.includes(arrivalMessage.sender)) {
        axios.get("/users/" + arrivalMessage.sender).then((res) => {
          toast(`you have a message from ${res.data.username}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        })

      }
    }

  }, [arrivalMessage]);

  useEffect(() => {
    const friendId = currentChat?.members.find((m) => m !== currentUser._id);
    if (friendId) {
      const getUser = async () => {
        try {
          const res = await axios.get("/users/" + friendId)
          console.log(res.data);
          setReciever(res.data)
        } catch (err) {
          console.log(err);
        }
      }
      getUser()
    };
  }, [currentUser, currentChat]);

  // useEffect(() => {
  //   const getConversations = async () => {
  //     try {
  //       const res = await axios.get("/conversations/" + currentUser._id);
  //       const sortedConversations = res.data.length > 2 ? res.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)) : res.data;
  //       setConversations(sortedConversations);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getConversations();
  // }, [currentUser._id]);


  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("/conversations/" + currentUser._id);
        const sortedConversations = res.data.length > 2 ? res.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)) : res.data;
        setConversations(sortedConversations);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [currentUser._id, arrivalMessage]);




  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("/messages/" + currentChat?._id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);


  const handleSubmit = async (e) => {
    socket.emit("addUser", { userId: currentUser._id })
    e.preventDefault();
    if (newMessage.trim().length !== 0 && newMessage != null) {
      const receiverId = currentChat.members.find(
        (member) => member !== currentUser._id
      );
      const message = {
        sender: currentUser._id,
        receiverId,
        text: newMessage,
        conversationId: currentChat._id,
      };
      socket.emit("sendMessage", {
        senderId: currentUser._id,
        receiverId,
        text: newMessage,
      });
            const filteredConversations = conversations.filter(
        (c) => c._id !== currentChat._id
      );
      setConversations([currentChat, ...filteredConversations]);

      setNewMessage("");


      try {
        let sendNot = false;
        setNotCount(notCount + 1);
        onlineUsers.includes(receiverId) || notCount === 0
          ? (sendNot = false)
          : (sendNot = true);

        const res = await axios.post(
          "/messages",
          { ...message, sendNot }
        );
        setMessages([...messages, res.data]);
        setNewMessage("");
      } catch (err) {
        console.log(err);
      }
    } else {
      setErr("please enter a message");
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };
  const handleChange = (newMessage) => {
    setErr(false);
    setNewMessage(newMessage);
  };
  return (
    <>
    <Box  sx={{
        backgroundImage: `url(https://res.cloudinary.com/dwpsyo2te/image/upload/v1689144066/SOCIAL-MEDIA/nukwpjw7hkch6qqj1i9w.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
      }}>
      <div className={`theme-${darkMode ? "dark" : "light"} animate-slideleft`}>
       
        <Navbar />
        <div style={{ display: "flex" }}>
          <div style={{ flex: 8 }}>
            <div className="messenger" 
             style={{
              backgroundColor:"transparent",
        backdropFilter: "blur(20px)",
        borderRadius: "1.2rem",
             }}
             >
              <div className="chatMenu">
                <input
                  value="Inbox"
                  className="chatMenuInput"
                  disabled
                  style={{ marginTop: "0.6rem", textAlign: "center" }}
                />
                <div className="chatMenuWrapper">
                  {conversations.map((c) => (
                    <div key={c._id} onClick={() => setCurrentChat(c)}>
                      <Conversation conversation={c} currentUser={currentUser} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="chatBox">
                <div className="chatBoxWrapper">
                  {currentChat && (
                    <><Link to={`/profile/${reciever?._id}`} style={{ zIndex: "1000" }}>
                      <img
                        className="messageImg"
                        src={
                          reciever?.profilePicture.length !== 0
                            ? reciever?.profilePicture
                            : "https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                        }
                        alt=""
                      /></Link></>
                  )}
                  <input
                    value={reciever ? reciever.username : "chat"}
                    className="receiver chatMenuInput"
                    disabled
                  />
                  {currentChat ? (
                    <>
                      <div className="chatBoxTop mt-3">
                        {messages.map((m) => (
                          <div ref={scrollRef} key={m.createdAt}>
                            <Message
                              message={m}
                              own={m.sender === currentUser._id}
                            />
                          </div>
                        ))}
                      </div>
                      {err && err}
                      <div className="chatBoxBottom">
                        <InputEmoji
                          value={newMessage}
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                        />
                        <button
                          className="chatSubmitButton"
                          onClick={handleSubmit}
                        >
                          Send
                        </button>
                      </div>
                    </>
                  ) : (
                    <span className="noConversationText font-bold text-5xl text-center mt-32">
                      Open a conversation to start a chat.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </Box>
    </>
  );
}


