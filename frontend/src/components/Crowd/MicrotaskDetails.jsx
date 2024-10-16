import Card from "../UI/Card";
import GeneralButton from "../UI/GeneralButton";
import classes from "./MicrotaskDetails.module.css";

function MicrotaskDetails(props) {
  const data = props.data;

  const rows1 = data.rows_1.split(",");
  const rows2 = data.rows_2.split(",");

  return (
    <Card className={classes.container}>
      <div>
        <h3 className={classes.header}>Check the following Columns for Schema Matching</h3>
      </div>
      <div className={classes.dataContainer}>
        <div className={classes.tableContainer}>
          <h3 className={classes.tableName}>Table 1: {data.table_1}</h3>
          <table>
            <thead>
              <tr>
                <th>{data.column_1}</th>
              </tr>
            </thead>
            <tbody>
              {rows1.map((row, index) => (
                <tr key={index}>
                  <td>{row}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={classes.tableContainer}>
          <h3 className={classes.tableName}>Table 2: {data.table_2}</h3>
          <table>
            <thead>
              <tr>
                <th>{data.column_2}</th>
              </tr>
            </thead>
            <tbody>
              {rows2.map((row, index) => (
                <tr key={index}>
                  <td>{row}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className={classes.question}>
        <p>
          Carefully compare the column name and contents from{" "}
          <strong>Table 1: {data.table_1}</strong> with those from{" "}
          <strong>Table 2: {data.table_2}</strong>.
        </p>
        <p>Do the two columns match in terms of structure and data?</p>
      </div>
      <div className={classes.actions}>
        <GeneralButton onClick={props.onYes} className={classes.yesButton}>
          Yes they Match
        </GeneralButton>
        <GeneralButton onClick={props.onNo} className={classes.noButton}>
          No, they don't match{" "}
        </GeneralButton>
        <GeneralButton onClick={props.onSkip} className={classes.skipButton}>
          I'm not sure
        </GeneralButton>
      </div>
    </Card>
  );
}

export default MicrotaskDetails;
