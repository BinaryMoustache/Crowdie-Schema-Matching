import classes from "./Card.module.css";

function Card(props) {
  const cardClasses = `${classes.card} ${props.className}`;

  return (
    <div className={cardClasses} onClick={props.onClick}>
      {props.children}
    </div>
  );
}

export default Card;
