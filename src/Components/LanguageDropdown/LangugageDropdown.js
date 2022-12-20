import { useEffect, useState } from "react";
import ListItem from "./ListItem/ListItem";
import { getLanguages } from "../../API/API";
import "./LanguageDropdown.css";

export default function LanguageDropdown({ setLanguages }) {
  const [chosenLanguagesName, setChosenLanguagesName] = useState([]);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [chosenLanguagesID, setChosenLanguagesID] = useState([]);

  useEffect(() => {
    async function getLanguagesOptions() {
      setLanguageOptions(await getLanguages());
    }
    getLanguagesOptions();
  }, []);

  useEffect(() => {
    if (chosenLanguagesName) {
      setLanguages(chosenLanguagesID);
    }
  }, [chosenLanguagesID]);

  function addToChosen(language) {
    setChosenLanguagesID((prevState) => [...prevState, language.value]);
    setChosenLanguagesName((prevState) => [...prevState, language.text]);
  }

  function deleteItem(index) {
    setChosenLanguagesName((prevState) => [
      ...prevState.filter((item, i) => i !== index),
    ]);
    setChosenLanguagesID((prevState) => [
      ...prevState.filter((item, i) => i !== index),
    ]);
  }

  return (
    <div className="languageDropdown">
      <select
        id="languages"
        name="languages"
        value=""
        onChange={(e) => addToChosen(e.target.selectedOptions[0])}
      >
        <option>select language</option>
        {languageOptions.map((language, index) => (
          <option key={language.id} value={language.id} index={index}>
            {language.get("name")}
          </option>
        ))}
      </select>
      <ul className="list-item">
        {chosenLanguagesName.map((language, index) => (
          <ListItem
            key={language.id}
            item={language}
            index={index}
            deleteItem={deleteItem}
          />
        ))}
      </ul>
    </div>
  );
}
