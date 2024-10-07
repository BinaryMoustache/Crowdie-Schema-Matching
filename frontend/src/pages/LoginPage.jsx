import { useState } from "react";
import Login from "../components/Authentication/LogIn";
import SignIn from "../components/Authentication/SignUpForm";
import Logo from "../components/UI/Logo";
import classes from "./LoginPage.module.css"

function LoginPage() {
  const [signInIsShown, setsignInIsShown] = useState(false);

  const showSignInHandler = () => {
    setsignInIsShown(true);
  };
  const hideSignInHandler = () => {
    setsignInIsShown(false);
  };
  return (
    <div className={classes.container}>
      <Logo />
      <Login onSignIn= {showSignInHandler}/>
      {signInIsShown && <SignIn onClose={hideSignInHandler} />}
    </div>
  );
}

export default LoginPage;
