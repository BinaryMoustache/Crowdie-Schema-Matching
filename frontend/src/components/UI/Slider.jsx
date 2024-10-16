import React from "react";
import classes from "./Slider.module.css";

const Slider = ({ value, onChange }) => {
  return (
    <div className={classes.sliderContainer}>
      <div className={classes.labels}>
        <span className={classes.label}>3</span>
        <span className={classes.label}>5</span>
        <span className={classes.label}>7</span>
        <span className={classes.label}>9</span>
      </div>
      <input
        type="range"
        id="participants"
        name="participants"
        min="3"
        max="9"
        step="2"
        value={value} // Controlled by parent
        onChange={(e) => onChange(Number(e.target.value))} // Notify parent on change
        className={classes.slider}
      />
      <div className={classes.valueDisplay}>
        Participants: {value}
      </div>
    </div>
  );
};

export default Slider;