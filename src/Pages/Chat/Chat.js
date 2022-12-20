import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ChatBox from "../../Components/ChatBox/ChatBox";
import ChatSidebar from "../../Components/ChatSidebar/ChatSidebar";
import { getCurrentUser, getUsersInChat } from "../../API/API";
import "./Chat.css";

export default function Chat() {
  const { state } = useLocation();
  const chat = state.chat;
  const [users, setUsers] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    async function getUsers() {
      const resultUsers = await getUsersInChat(chat);
      setUsers(resultUsers);
    }
    getUsers();
  }, [chat]);

  if (users) {
    var otherUsers = [];
    var images = [];
    for (var user of users) {
      if (user.id !== getCurrentUser().id) {
        images.push(user.get("profilePicture").get("catPNG")._url);
        otherUsers.push(user);
      }
    }

    function goHome() {
      navigate("/home");
    }

    return (
      <div className="chat-page">
        <img
          key={chat.id}
          className="home-icon"
          src="./Icons/home.png"
          alt="Home icon"
          onClick={goHome}
        />
        <div className="chat-partner">
          {images.map((image, index) => {
            return (
              <img
                key={index}
                className="partner-pic"
                src={image}
                alt="Other users profile icon"
              />
            );
          })}
          {otherUsers.map((otherUser) => {
            return (
              <header key={otherUser.id} className="partner-name">
                {otherUser.get("username")}
              </header>
            );
          })}
        </div>
        <div className="chat-sidebar">
          <ChatSidebar chat={chat} />
        </div>
        <ChatBox chat={chat} />
      </div>
    );
  }
}
