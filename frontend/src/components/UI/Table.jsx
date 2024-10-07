import classes from "./Table.module.css";

function Table(props) {
  return (
    <table className={classes.minimalistBlack}>
      <thead>
        <tr>
          <th>{props.column_name}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{props.row1}</td>
        </tr>
        <tr>
          <td>{props.row2}</td>
        </tr>
        <tr>
          <td>{props.row3}</td>
        </tr>
      </tbody>
    </table>
  );
}

export default Table;