import Parse from "parse";
import { useParseQuery } from "@parse/react";
import { useState } from "react";
import { sendMessage } from "./API";

export default function LiveMessagesAPI(chat) {
  const [messageInput, setMessageInput] = useState("");

  async function handleSend() {
    try {
      const messageText = messageInput;
      if (messageText !== "") {
        await sendMessage(messageText, chat);
        setMessageInput("");
      }
    } catch (error) {
      alert(error);
    }
  }

  function handleChange(event) {
    setMessageInput(event.target.value);
  }

  const parseQuery = new Parse.Query("Message");
  parseQuery.equalTo("chat", chat);
  parseQuery.include("chat");
  parseQuery.ascending("createdAt");

  const { isLive, isLoading, isSyncing, results, count, error } = useParseQuery(
    parseQuery,
    {
      enableLocalDatastore: true, // Enables cache in local datastore (default: true)
      enableLiveQuery: true, // Enables live query for real-time update (default: true)
    }
  );

  const messages = results;

  return {
    messages,
    messageInput,
    handle: { send: handleSend, change: handleChange },
    status: { isLive, isLoading, isSyncing },
    count,
    error,
  };
}
