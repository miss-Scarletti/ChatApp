import Message from "../Message/Message";
import Button from "../Button/Button";
import "../Button/Button.css";
import "./ChatBox.css";
import LiveMessagesAPI from "../../API/LiveMessagesAPI";
import { getCurrentUser } from "../../API/API";
import { useEffect, useRef } from "react";

export default function ChatBox({ chat }) {
  const { messageInput, handle, status, messages, count, error } =
    LiveMessagesAPI(chat);
  const newMessage = useRef(null);

  useEffect(() => {
    if (newMessage) {
      newMessage.current.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
  }, [messages]);

  function onEnterPress(e) {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      handle.send();
    }
  }

  return (
    <div className="chat-box">
      <div className="threat" ref={newMessage}>
        {messages && (
          <div className="message-list">
            {messages
              .sort((a, b) => a.get("createdAt") > b.get("createdAt"))
              .map((message) => (
                <div
                  key={message.id}
                  className={
                    message.get("sender").id === getCurrentUser().id
                      ? "message_sent"
                      : "message_received"
                  }
                >
                  <Message message={message} />
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="sending-messages">
        <form className="input-form" action="/form/submit" method="GET">
          <textarea
            className="input-area"
            type="submit"
            cols="60"
            rows="5"
            value={messageInput}
            onChange={handle.change}
            onKeyDown={onEnterPress}
            placeholder={"Your message..."}
          ></textarea>
        </form>

        <Button className="send-btn" text="Send" click={handle.send} />

        <img
          key="iconCat"
          className="cat-icon"
          src="../Icons/welcome-cat.png"
          alt="welcome-cat-icon"
        />
        <div className="server-info">
          {status.isLoading && <p>{"Loading…"}</p>}
          {status.isSyncing && <p>{"Syncing…"}</p>}
          {status.isLive ? <p>{"Status: Live"}</p> : <p>{"Status: Offline"}</p>}
          {error && <p>{error.message}</p>}
          {count && <p>{`Count: ${count}`}</p>}
        </div>
      </div>
    </div>
  );
}
