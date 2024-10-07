import classes from "./InputSelect.module.css";

function InputSelect(props) {
  const containerClasses = `${classes.container} ${props.className || ""}`;

  return (
    <div className={containerClasses}>
      {props.label && (
        <label htmlFor={props.id || "input-select"}>{props.label}</label>
      )}
      <select
        id={props.id || "input-select"}
        value={props.value}
        onChange={props.onChange}
        required={props.required || false}
      >
        <option value="" disabled>
          Select
        </option>
        {props.options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default InputSelect;
