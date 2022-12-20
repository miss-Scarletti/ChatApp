import React from "react";
import ChatListItem from "./ChatListItem";
import "./ChatList.css";

export default function ChatList({ chatList, deleteChat }) {
  return (
    <div>
      {chatList.map((chat) => {
        return (
          <ChatListItem key={chat.id} chat={chat} deleteChat={deleteChat} />
        );
      })}
    </div>
  );
}
