import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../DesignSystem/grid.css";
import "./PasswordReset.css";
import Button from "../../Components/Button/Button";
import { passwordReset } from "../../API/API";

export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  async function handlePasswordReset() {
    const reset = await passwordReset(email);
    if (reset) {
      setEmail("");
      alert(`Success! Please check ${email} to proceed with password reset.`);
    } else {
      alert("No user with this email exists");
    }
  }

  function goBack() {
    navigate("/");
  }

  return (
    <div className="password-reset">
      <div className="purple-box">
        <img
          src="./Icons/go-back.png"
          className="go-back"
          alt="user icon"
          onClick={goBack}
        />
        <div className="heading-top">
          <img
            className="header-logo"
            src="./Icons/welcome-cat.png"
            alt="cat mascot"
          />
          <h1 className="heading">Forgot your password?</h1>
          <p>
            Please enter your email to receive a request to reset your password
          </p>
        </div>

        <input
          className="input"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Your account email"
        />
        <Button text="Reset password" click={handlePasswordReset} />
      </div>
    </div>
  );
}
