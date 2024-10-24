import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";

import GeneralButton from "../UI/GeneralButton";
import Logo from "../UI/Logo";
import classes from "./Header.module.css";


function Header(props) {
  return (
    <header className={classes.header}>
      <div className={classes.container}>
        <FaBars className={classes.bars} onClick={props.onClick} />
       <Link  className = {classes.link}to="/"><Logo /></Link> 
      </div>
      <div>
        <GeneralButton
          onClick={props.onLogout}
          className={classes.logoutbutton}
        >
          Logout
        </GeneralButton>
      </div>
    </header>
  );
}

export default Header;
