import classes from "./InputText.module.css";

function InputText(props) {
  const containerClasses = `${classes.container} ${props.className || ""}`;

  return (
    <div className={containerClasses}>
      {props.label && (
        <label htmlFor={props.id || "input-text"}>{props.label}</label>
      )}
      <input
        id={props.id || "input-text"}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder || "Enter text..."}
        type={props.type || "text"}
        required={props.required || false}
        min={props.min}
        max={props.max} 
        step={props.step}
        autoComplete={props.autocomplete || "off"}
      />
    </div>
  );
}

export default InputText;
