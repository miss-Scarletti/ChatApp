import "./DesignSystem/colours.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import SignIn from "./Pages/SignIn/SignIn.js";
import SignUp from "./Pages/SignUp/SignUp";
import PasswordReset from "./Pages/PasswordRequest.js/PasswordReset";
import Chat from "./Pages/Chat/Chat";
import Parse from "parse";
import { initializeParse } from "@parse/react";

const ParseAppID = process.env.REACT_APP_PARSE_APPLICATION_ID;
const ParseHostURL = process.env.REACT_APP_PARSE_HOST_URL;
const ParseJavaScriptKey = process.env.REACT_APP_PARSE_JAVASCRIPT_KEY;

initializeParse(ParseHostURL, ParseAppID, ParseJavaScriptKey);

Parse.enableLocalDatastore();

export default function App() {
  return (
    <BrowserRouter>
      <div className="App"></div>
      <Routes>
        <Route path="/" element={<SignIn page="SignIn" />} />
        <Route path="/signup" element={<SignUp page="SignUp" />} />
        <Route path="/home" element={<Home page="Home" />} />
        <Route path="/chat" element={<Chat page="Chat" />} />
        <Route
          path="passwordReset"
          element={<PasswordReset page="PasswordReset" />}
        />
      </Routes>
    </BrowserRouter>
  );
}


