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
        <Logo style={{ color: "whitesmoke" }} />
      </div>
      <div className={classes.second_container}>
        <NavLink
          className={({ isActive }) =>
            isActive ? classes.linkactive : undefined
          }
          to="mytasks"
          onClick={props.onClick}
        >
          My Tasks
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? classes.linkactive : undefined
          }
          to="crowdtasks"
          onClick={props.onClick}
        >
          Crowd Tasks
        </NavLink>
      </div>
    </div>
  );
});

export default SideBar;
