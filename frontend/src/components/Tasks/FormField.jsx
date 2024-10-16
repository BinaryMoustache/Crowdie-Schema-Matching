import { GoChevronUp, GoChevronDown } from "react-icons/go";
import GeneralButton from "../UI/GeneralButton";
import classes from "./FormField.module.css";

function FormField({ field, index, isActive, onToggle, onContinue }) {
  return (
    <li
      className={`${classes.fieldItem} ${isActive ? classes.activeField : ""}`}
    >
      <div className={classes.smallContainer}>
        <p className={classes.label}>{field.label}</p>
        <span
          onClick={() => onToggle(index)}
          style={{
            cursor: index === 0 || field.value ? "pointer" : "default",
            opacity: index === 0 || field.value ? 1 : 0.5,
          }}
        >
          {isActive ? <GoChevronUp /> : <GoChevronDown />}
        </span>
      </div>

      {isActive && (
        <>
          {field.component}
          <div className={classes.description}>{field.description}</div>

          {index < 5 && (
            <GeneralButton
              className={classes.continueButton}
              type="button"
              onClick={onContinue}
              disabled={!field.value && field.value !== 0}
            >
              Continue
            </GeneralButton>
          )}
        </>
      )}

      {!isActive && field.value && (
        <p className={classes.value}>{field.value}</p>
      )}
    </li>
  );
}

export default FormField;
