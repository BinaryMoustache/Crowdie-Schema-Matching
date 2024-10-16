import { useState } from "react";

import SignIn from "../components/Authentication/SignUpForm";
import Info from "../components/Authentication/Info";


function AuthenticationPage() {
  const [signInIsShown, setsignInIsShown] = useState(false);

  const showSignInHandler = () => {
    setsignInIsShown(true);
  };
  const hideSignInHandler = () => {
    setsignInIsShown(false);
  };
  return (
    <div >
      <Info onSignUp={showSignInHandler} />
   
      {signInIsShown && <SignIn onClose={hideSignInHandler} />}
    </div>
  );
}

export default AuthenticationPage;
