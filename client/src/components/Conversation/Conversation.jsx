
import {  useEffect, useState } from "react";
import axios from "../../utils/axios";
import "./conversation.css";

export default function Conversation({ conversation, currentUser}) {
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let friendId = conversation.members.find((m) => m !== currentUser._id);
    const getUser = async () => {
      try {
        const res = await axios.get("/users/" + friendId);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);
  

  useEffect(() => {
    const getUnreadCount = async () => {
      try {
        const res = await axios.get(`/messages/unread/${conversation._id}`);
        setUnreadCount(res.data.unreadCount);
      } catch (err) {
        console.log(err);
      }
    };
    getUnreadCount();
  }, [conversation]);


  return (
    <div className="conversation rounded-full">
      <img
        className="conversationImg"
        src={
          user?.picturePath
            ? user.picturePath
            :"https://i.pinimg.com/originals/0d/dc/ca/0ddccae723d85a703b798a5e682c23c1.png"
        }
        alt=""
      />
      <span className="conversationName">{user?.firstName} {user?.lastName}</span>
      {unreadCount > 0 && (
        <span className="unreadCount">{unreadCount}</span>
      )}
    </div>
  );
}



