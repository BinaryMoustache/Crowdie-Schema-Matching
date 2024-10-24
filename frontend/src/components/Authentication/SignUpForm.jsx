import { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { env } from "../../utils/env";

import Modal from "../UI/Modal";
import GeneralButton from "../UI/GeneralButton";
import InputText from "../UI/InputText";
import InputSelect from "../UI/InputSelect";
import classes from "./SignUpForm.module.css";

const formReducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_PASSWORDS_MATCH":
      return { ...state, passwordsMatch: action.value };
    case "SET_PASSWORD_ERROR":
      return { ...state, passwordError: action.value };
    case "SET_USERNAME_ERROR":
      return { ...state, usernameError: action.value };
    case "RESET_CS_FIELDS":
      return { ...state, studyLevel: "", experience: "" }; 
    default:
      return state;
  }
};

function SignIn(props) {
  const [formState, dispatch] = useReducer(formReducer, {
    username: "",
    password: "",
    retypePassword: "",
    hasCsBackground: false,
    studyLevel: "",
    experience: "",
    passwordsMatch: true,
    passwordError: null,
    usernameError: null,
  });

  const navigate = useNavigate();

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasMinLength) {
      return "Password must be at least 8 characters long.";
    }
    if (!hasNumber) {
      return "Password must contain at least one digit.";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character.";
    }
    return null;
  };

  const handleFieldChange = (field, value) => {
    dispatch({ type: "SET_FIELD", field, value });

    if (field === "password") {
      const passwordError = validatePassword(value);
      dispatch({ type: "SET_PASSWORD_ERROR", value: passwordError });
    }

    if (field === "retypePassword") {
      dispatch({
        type: "SET_PASSWORDS_MATCH",
        value: value === formState.password,
      });
    }

    if (field === "hasCsBackground" && value === false) {
      dispatch({ type: "RESET_CS_FIELDS" });
    }
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    const passwordValidationError = validatePassword(formState.password);
    if (passwordValidationError) {
      dispatch({ type: "SET_PASSWORD_ERROR", value: passwordValidationError });
      return;
    }

    if (formState.password !== formState.retypePassword) {
      dispatch({ type: "SET_PASSWORDS_MATCH", value: false });
      return;
    }

    try {
      const response = await fetch(`${env.BACKEND_URL}/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formState.username,
          password: formState.password,
          cs_background: formState.hasCsBackground,
          study_level: formState.hasCsBackground ? formState.studyLevel : "",
          experience: formState.hasCsBackground ? formState.experience : "",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.detail === "Username already exists.") {
          dispatch({
            type: "SET_USERNAME_ERROR",
            value: "Username already exists. Please choose another.",
          });
        } else {
          alert(
            "Failed to create user: " +
              (errorData.detail || "An unexpected error occurred.")
          );
        }
        return;
      }

      const data = await response.json();
      const token = data.access_token;

      localStorage.setItem("token", token);
      navigate("/");
    } catch (error) {
      alert("An error occurred during signup. Please try again later.");
    }
  };

  return (
    <Modal open={true}>
      <div className={classes.container}>
        <h2 className={classes.small_header}>Join the Crowdie Community</h2>
        <form onSubmit={formSubmitHandler} className={classes.form}>
          <div>
            <InputText
              id="user"
              label="username"
              value={formState.username}
              onChange={(e) => handleFieldChange("username", e.target.value)}
              placeholder="Enter username"
              required={true}
            />
            {formState.usernameError && (
              <p className={classes.error_text}>{formState.usernameError}</p>
            )}
          </div>
          <InputText
            id="pass"
            type="password"
            label="password"
            value={formState.password}
            onChange={(e) => handleFieldChange("password", e.target.value)}
            placeholder="Enter password"
            required={true}
          />
          {formState.passwordError && (
            <p className={classes.error_text}>{formState.passwordError}</p>
          )}
          <div>
            <InputText
              id="re-pass"
              type="password"
              label="re-type password"
              value={formState.retypePassword}
              onChange={(e) =>
                handleFieldChange("retypePassword", e.target.value)
              }
              placeholder="Re-type password"
              required={true}
            />
            {!formState.passwordsMatch && (
              <p className={classes.error_text}>Passwords do not match.</p>
            )}
          </div>
          <InputSelect
            id="cs-back"
            label="Do you have a background in Computer Science?"
            value={formState.hasCsBackground}
            onChange={(e) =>
              handleFieldChange("hasCsBackground", e.target.value === "true")
            }
            required={true}
            options={[
              { label: "Yes", value: true },
              { label: "No", value: false },
            ]}
          />
          {formState.hasCsBackground && (
            <>
              <InputSelect
                id="study-level"
                label="level of study"
                value={formState.studyLevel}
                onChange={(e) =>
                  handleFieldChange("studyLevel", e.target.value)
                }
                options={[
                  { label: "Bachelor", value: "bsc" },
                  { label: "Master", value: "msc" },
                  { label: "Phd", value: "phd" },
                ]}
              />
              <InputSelect
                id="years-exp"
                label="years of experience"
                value={formState.experience}
                onChange={(e) =>
                  handleFieldChange("experience", e.target.value)
                }
                options={[
                  { label: "0-2 years", value: "0-2" },
                  { label: "3-5 years", value: "3-5" },
                  { label: "5+ years", value: "5+" },
                ]}
              />
            </>
          )}
          <div className={classes.buttoncontainer}>
            <GeneralButton
              className={classes.cancel}
              type="button"
              onClick={props.onClose}
            >
              Cancel
            </GeneralButton>
            <GeneralButton className={classes.submitbutton} type="submit">
              Submit
            </GeneralButton>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default SignIn;
