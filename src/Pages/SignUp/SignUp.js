import LanguageDropdown from "../../Components/LanguageDropdown/LangugageDropdown";
import "./SignUp.css";
import "../../DesignSystem/grid.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../Components/Button/Button";
import { createUser, getCatIcons } from "../../API/API";

export default function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [email, setEmail] = useState("");
  const [nativeLangs, setNativeLangs] = useState([]);
  const [targetLangs, setTargetLangs] = useState([]);
  const [catIcons, setCatIcons] = useState(null);
  const [userPic, setUserPic] = useState(null);

  useEffect(() => {
    async function getIcons() {
      try {
        const resultIcons = await getCatIcons();
        setCatIcons(resultIcons);
        setUserPic(resultIcons[0]);
      } catch (error) {
        console.log(`Error when trying to read cat icons: ${error}`);
      }
    }
    getIcons();
  }, []);

  function makeProfileSelection() {
    try {
      return (
        <>
          {catIcons.map((catIcon) => (
            <img
              key={catIcon.id}
              alt={catIcon.get("name")}
              src={catIcon.get("catPNG")._url}
              onClick={() => handleSelect(catIcon)}
            />
          ))}
        </>
      );
    } catch (error) {
      return false;
    }
  }

  function handleSelect(catIcon) {
    setUserPic(catIcon);
    const profPic = document.getElementById("ProfilePicture");
    profPic.src = catIcon.get("catPNG")._url;
  }

  async function handleSubmit() {
    if (checkPassword()) {
      if (isNotEmpty(nativeLangs) && isNotEmpty(targetLangs)) {
        const newUser = await createUser(
          username,
          password,
          email,
          nativeLangs,
          targetLangs,
          userPic
        );
        if (newUser) {
          navigate("/home");
        }
      } else {
        alert("You need at least one native and target language.");
      }
    } else {
      alert("Your password does not match");
    }
  }

  function isNotEmpty(variable) {
    if (variable === null || variable === "" || variable.length === 0) {
      return false;
    }
    return true;
  }

  function checkPassword() {
    if (password === repeatPassword) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <div className="sign-up-page">
      <div className="purple-box profile-box">
        <img
          className="selected-pic"
          id="ProfilePicture"
          alt="Profile"
          src={catIcons !== null ? catIcons[0].get("catPNG")._url : "altText"}
        />
        <h3>Select a profile picture:</h3>
        <div className="picture-box">
          <div className="picture-selection">{makeProfileSelection()}</div>
        </div>
      </div>
      <div className="profile-info-box">
        <div className="user-inputs">
          <div className="profile-info-labels">
            <div>
              <label>Username:</label>
            </div>
            <div>
              <label>E-mail :</label>
            </div>
            <div>
              <label>Password: </label>
            </div>
            <div>
              <label>Repeat password: </label>
            </div>
            <div>
              <label>What is your native language</label>
            </div>
            <div>
              <label>What languages do you want to learn?</label>
            </div>
          </div>

          <div className="profile-info-inputs">
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Username"
              size="large"
              className="form_input"
            />
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="email"
              size="large"
              className="form_input"
            />
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="password"
              size="large"
              type="password"
            />
            <input
              value={repeatPassword}
              onChange={(event) => setRepeatPassword(event.target.value)}
              placeholder="repeat password"
              size="large"
              type="password"
            />
            <LanguageDropdown
              className="dropdown"
              setLanguages={setNativeLangs}
            />
            <LanguageDropdown
              className="dropdown"
              setLanguages={setTargetLangs}
            />
          </div>
        </div>
        <div className="submit-button">
          <Button text="Sign Up" click={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
