import GeneralButton from "../UI/GeneralButton";
import Logo from "../UI/Logo";
import classes from "./Header.module.css";
import { FaBars } from "react-icons/fa";

function Header(props) {
  return (
    <header className={classes.header}>
      <div className={classes.container}>
        <FaBars className={classes.bars} onClick={props.onClick} />
        <Logo />
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
