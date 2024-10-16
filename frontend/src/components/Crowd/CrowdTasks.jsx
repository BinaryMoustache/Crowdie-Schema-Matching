import CrowdTasksGrid from "./CrowdTaskGrid";
import classes from "./CrowdTasks.module.css";

function CrowdTasks() {
  return (
    <div className={classes.container}>
      <div className={classes.infoContainer}>
        <h2 className={classes.header}>
          Select a Schema Matching Task to Get Started!
        </h2>
        <p className={classes.description}>
          You will work on <strong>schema matching</strong> tasks, aligning
          fields or attributes from different data tables to ensure they match.
        </p>

        <h3 className={classes.instructionsHeader}>Instructions:</h3>
        <ol className={classes.instructionsList}>
          <li>
            <strong>Browse Tasks:</strong> Review the available tasks on the
            right; each task will ask you to match schemas between different
            data tables.
          </li>
          <li>
            <strong>Select a Task:</strong> Click on a task that interests you.
          </li>
          <li>
            <strong>Perform Schema Matching:</strong> Each task consists of
            several microtasks where you will see two columns from different
            tables. Your job is to determine whether they match.
          </li>
        </ol>
      </div>
      <div className={classes.gridContainer}>
        <CrowdTasksGrid />
      </div>
    </div>
  );
}

export default CrowdTasks;
