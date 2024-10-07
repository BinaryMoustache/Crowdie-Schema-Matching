import classes from "./Logo.module.css";

function Logo(props) {
  return (
    <div className={classes.container}>
      <h1 className={classes.logo} style={props.style}>Crowdie</h1>
      <p className={classes.subtitle} style={props.style}>
        <i>Yet Another Crowdsourcing Research</i>
      </p>
    </div>
  );
}

export default Logo;
