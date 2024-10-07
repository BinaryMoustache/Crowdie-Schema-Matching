import classes from "./GeneralButton.module.css";

function GeneralButton(props) {
  const buttonClassName = `${classes.generalbutton} ${
    props.className || ""
  }`.trim();

  return (
    <button
      className={buttonClassName}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}

export default GeneralButton; 
