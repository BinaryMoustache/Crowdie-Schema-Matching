import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GeneralButton from "../UI/GeneralButton";
import InputText from "../UI/InputText";
import classes from "./Login.module.css";

function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const signInHandler = async (event) => {
    event.preventDefault();
    setError(null);
    if (username.trim() === "" || password.trim() === "") {
      setError("Both username and password are required.");
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/users/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials. Please try again.");
      }

      const data = await response.json();
      const token = data.access_token;
      localStorage.setItem("token", token);

      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const createAccountHandler = () => {
    props.onSignUp();
  };

  return (
    <div className={classes.container}>
      <form onSubmit={signInHandler}>
        <div className={classes.inputs}>
          <InputText
            id="user-text"
            label="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />

          <InputText
            id="user-pass"
            label="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />

          {error && <p className={classes.error_style}>{error}</p>}
        </div>

        <div className={classes.actions}>
          <button
            type="button"
            className={classes.textbutton}
            onClick={createAccountHandler}
          >
            Create a new account
          </button>
          <GeneralButton type="sumbit" className={classes.signinbutton}>
            Sign In
          </GeneralButton>
        </div>
      </form>
    </div>
  );
}

export default Login;
