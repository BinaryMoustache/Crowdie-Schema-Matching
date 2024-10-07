import { useState } from "react";
import {useNavigate} from "react-router-dom"
import classes from "./SignUpForm.module.css";
import Modal from "../UI/Modal";
import GeneralButton from "../UI/GeneralButton";
import InputText from "../UI/InputText";
import InputSelect from "../UI/InputSelect";

function SignIn(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [hasCsBackground, setHasCsBackground] = useState("");
  const [studyLevel, setStudyLevel] = useState("");
  const [experience, setExperience] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const retypePasswordChangeHandler = (e) => {
    setRetypePassword(e.target.value);
    setPasswordsMatch(e.target.value === password);
  };

  const navigate =  useNavigate()
  const formSubmitHandler = async (event) => {
    event.preventDefault();

    if (password !== retypePassword) {
      setPasswordsMatch(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/users/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
          cs_background: hasCsBackground,
          study_level: hasCsBackground === "yes" ? studyLevel : "",
          experience: hasCsBackground === "yes" ? experience : "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create user.");
      }

      const data = await response.json();
      const token = data.access_token;
      localStorage.setItem("token", token);
      console.log("User created:", data);
      navigate("/")
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Modal open={true}>
      <div className={classes.container}>
        <p className={classes.small_header}>Join the Crowdie Community</p>
        {errorMessage && (
          <p className={classes.error}>{errorMessage}</p>
        )}
        <form onSubmit={formSubmitHandler} className={classes.form}>
          <InputText
            id="user"
            label="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            placeholder="Enter username"
            required={true}
          />
          <InputText
            id="pass"
            type="password"
            label="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Enter password"
            required={true}
          />
          <InputText
            id="re-pass"
            type="password"
            label="re-type password"
            value={retypePassword}
            onChange={retypePasswordChangeHandler}
            placeholder="Re-type password"
            required={true}
          />

          {!passwordsMatch && (
            <p className={classes.error_text}>Passwords do not match.</p>
          )}

          <InputSelect
            id="cs-back"
            label="Do you have a background in Computer Science?"
            value={hasCsBackground}
            onChange={(e) => {
              setHasCsBackground(e.target.value);
            }}
            required={true}
            options={[
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ]}
          />
          {hasCsBackground == "yes" && (
            <>
              <InputSelect
                id="study-level"
                label="level of study"
                value={studyLevel}
                onChange={(e) => {
                  setStudyLevel(e.target.value);
                }}
                options={[
                  { label: "Bachelor", value: "bsc" },
                  { label: "Master", value: "msc" },
                  { label: "Phd", value: "phd" },
                ]}
              />
              <InputSelect
                id="years-exp"
                label="years of experience of"
                value={experience}
                onChange={(e) => {
                  setExperience(e.target.value);
                }}
                options={[
                  { label: "0-2 years", value: "0-2" },
                  { label: "3-5 years", value: "3-5" },
                  { label: "5+ years", value: "5+" },
                ]}
              />
            </>
          )}
          <div className={classes.buttoncontainer}>
            <GeneralButton className={classes.cancel} type="button" onClick={props.onClose}>
              Cancel
            </GeneralButton>
            <GeneralButton className = {classes.submitbutton}type="submit">Submit</GeneralButton>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default SignIn;
