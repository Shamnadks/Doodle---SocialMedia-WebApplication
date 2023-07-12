import "./message.css";
import {  useEffect, useState } from "react";
import axios from "../../utils/axios";
import ReactTimeAgo from 'react-timeago'


export default function Message({ message, own }) {
  const [user, setUser] = useState({})
  useEffect(() => {
    async function getUser (){
    const res = await axios.get("/users/" + message.sender)
    setUser(res.data)
   }
    getUser()
  }, [message])
  
  
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src={user?user.picturePath:"https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"}
          alt=""
        />
        <p className="messageText">{message?.text}</p>
      </div>
      <div className="messageBottom"><ReactTimeAgo date={message.createdAt}locale="en-US"/></div>
    </div>
  );
}


// export default function Message({ message, own }) {
//   const [user, setUser] = useState({})
//   const {config} = useContext(AuthContext)
//   useEffect(() => {
//     async function getUser (){
//     const res = await axios.get("/users/" + message.sender,config)
//     setUser(res.data)
//    }
//     getUser()
//   }, [message])
  
  
//   return (
//     <div className={own ? "message own" : "message"}>
//       <div className="messageTop">
//         <img
//           className="messageImg"
//           src={user?user.profilePicture:"https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"}
//           alt=""
//         />
//         <p className="messageText">{message?.text}</p>
//       </div>
//       <div className="messageBottom"><ReactTimeAgo date={message.createdAt}locale="en-US"/></div>
//     </div>
//   );
// }
