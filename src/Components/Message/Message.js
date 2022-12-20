import { getCurrentUser } from "../../API/API";
import "./Message.css";

export default function Message({ message }) {
  const sender = message.get("sender");
  const content = message.get("text");
  const timestamp = formatDateToTime(message.get("createdAt"));

  function formatDateToTime(date) {
    function add_zero(number) {
      return ("0" + number).slice(-2);
    }
    return `${add_zero(date.getDate())}. ${date.toLocaleString("default", {
      month: "short",
    })} ${add_zero(date.getHours())}:${add_zero(date.getMinutes())}`;
  }

  function sentByMe() {
    if (sender.id === getCurrentUser().id) {
      return true;
    }
    return false;
  }

  function getAuthor() {
    return sender.get("username");
  }

  return (
    <div className="message" type={sentByMe() ? "sent" : "received"}>
      <div className="author">{getAuthor()}</div>
      <div className="content" type={sentByMe() ? "sent" : "received"}>
        {content}
      </div>
      <div className="timestamp">{timestamp}</div>
    </div>
  );
}
