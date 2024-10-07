import Card from "../UI/Card";
import GeneralButton from "../UI/GeneralButton";
import classes from "./MicrotaskDetails.module.css";

function MicrotaskDetails(props) {
  const data = props.data;

  const rows1 = data.rows_1.split(",");
  const rows2=  data.rows_2.split(",");

  return (
    <div>
      <Card className={classes.container}>
        <div className={classes.question}>
          <p>
            Is the column from <strong>Table 1: {data.table_1}</strong> similar
            with the column from <strong>Table 2: {data.table_2}?</strong>
          </p>

          <div className={classes.dataContainer}>
            <div className={classes.tableContainer}>
              <h3>Table 1</h3>
              <table border="1" cellPadding="10" cellSpacing="0">
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
              <h3>Table 2</h3>
              <table border="1" cellPadding="10" cellSpacing="0">
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
        </div>
        <div className={classes.actions}><GeneralButton>Yes</GeneralButton>
        <GeneralButton>No</GeneralButton>
        <GeneralButton>Skip</GeneralButton></div>
      </Card>
    </div>
  );
}

export default MicrotaskDetails;
