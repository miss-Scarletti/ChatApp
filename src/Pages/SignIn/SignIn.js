import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../Components/Button/Button";
import "./SignIn.css";
import "../../DesignSystem/grid.css";
import { getCurrentUser, logIn } from "../../API/API";

export default function SignIn() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogIn() {
    try {
      await logIn(username, password);
      if (getCurrentUser() !== null) {
        setUsername("");
        setPassword("");
        navigate("/home");
      } else {
        navigate("/");
      }
    } catch (error) {
      alert(`Error while logging in! ${error.message}`);
    }
  }

  const goToPasswordRequest = () => {
    navigate("passwordReset");
  };

  return (
    <div>
      <div className="sign-in-page">
        <div className="sign-in-box purple-box">
          <img
            className="header-logo"
            src="./Icons/welcome-cat.png"
            alt="cat mascot"
          />
          <h1 className="header-welcome">WELCOME</h1>

          <form className="inputs">
            <div className="input-container">
              <input
                className="input-field"
                type="text"
                name="uname"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Username"
                required
              />
              <img
                src="./Icons/welcome-user-90.png"
                className="input-logo"
                alt="user icon"
              />
            </div>
            <div className="input-container">
              <input
                className="input-field"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                name="pass"
                placeholder="Password"
                required
              />
              <img
                src="./Icons/welcome-lock.png"
                className="input-logo"
                alt="icon of a lock to symbolise password field"
              />
            </div>
          </form>
          <div className="forgot-pass" onClick={goToPasswordRequest}>
            Forgot password?
          </div>
          <div className="login-button">
            <Button text="Login" click={handleLogIn} />
          </div>
          <Link className="signup-button" to="signUp">
            <Button text="Sign Up" />
          </Link>
        </div>
      </div>
    </div>
  );
}
