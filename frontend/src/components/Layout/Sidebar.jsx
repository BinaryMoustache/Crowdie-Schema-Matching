import { FaBars } from "react-icons/fa";
import Logo from "../UI/Logo";
import classes from "./Sidebar.module.css";
import { NavLink } from "react-router-dom";
import { forwardRef } from "react";

const SideBar = forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      className={`${classes.sidebar} ${props.active ? classes.active : ""}`}
    >
      <div className={classes.first_container}>
        <FaBars className={classes.bars} onClick={props.onClick} />
        <Logo style={{ color: "white" }} />
      </div>
      <div className={classes.second_container}>
        <NavLink to="mytasks">My Tasks</NavLink>
        <NavLink to="crowdtasks">Crowd Tasks</NavLink>
      </div>
    </div>
  );
});

export default SideBar;
