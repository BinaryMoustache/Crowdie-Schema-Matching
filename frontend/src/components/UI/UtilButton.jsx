import classes from "./UtilButton.module.css";

function UtilButton({ icon: Icon, onClick, disabled, children, size = 20, }) {
  return (
    <button
      className={classes.createbutton}
      onClick={onClick}       
      disabled={disabled}      
    >
      <Icon size={size} style={{ marginRight: "2px" }} />
      {children}              
    </button>
  );
}

export default UtilButton;