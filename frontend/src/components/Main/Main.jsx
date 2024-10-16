import { useNavigate } from "react-router-dom";
import { PiUsersThreeLight } from "react-icons/pi";
import { IoCreateOutline } from "react-icons/io5";

import classes from "./Main.module.css";

function Main() {
  const navigate = useNavigate();

  return (
    <div className={classes.container}>
      <h1>Hello, Welcome!</h1>
      <p>Ready to dive in? Choose how you’d like to get started below:</p>

      <div className={classes.hubContainer}>
        <div className={classes.cardContainer} onClick={()=>{navigate("/mytasks")}}>
          <h2>Create and Track Your Tasks</h2>
          <IoCreateOutline size={55} color="white" />
          <p>
            Create and manage schema matching tasks, then let the crowd complete
            them. Stay updated by tracking their progress and reviewing the
            results{" "}
          </p>{" "}
        </div>

        <div
          className={classes.cardContainer}
          onClick={()=>{navigate("/crowdtasks")}}
        >
          <h2>Join the Crowd and Contribute</h2>
          <PiUsersThreeLight size={60} color="white" />
          <p>
            {" "}
            Contribute as a crowd worker and assist others in completing their
            schema matching tasks. Your insights can make a real impact!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Main;
