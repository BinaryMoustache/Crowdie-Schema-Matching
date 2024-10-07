import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../UI/Card";
import classes from "./CrowdTaskGrid.module.css";
import { getAuthToken } from "../../utils/auth";
import GeneralButton from "../UI/GeneralButton";

function CrowdTasksGrid() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      const token = getAuthToken();

      try {
        const response = await fetch(
          "http://localhost:8000/tasks/crowd_tasks/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();
        setTasks(data.tasks || []);
        console.log(tasks);
        console.log(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTasks();
  }, []);

  return (
    <>
      {error && <p className={classes.errorText}>{error}</p>}
      {tasks.length > 0 ? (
        <div className={classes.gridContainer}>
          {tasks.map((task) => (
            <div key={task.task_id}>
              <Card className={classes.cardContainer}>
                <div className={classes.child}>
                  <h3>Task Name: {task.name}</h3>
                </div>
                <div className={classes.child}>
                  <p>Description: {task.description}</p>
                </div>
                <p>Created by: {task.username}</p>
                <div className={classes.actions}>
                  <GeneralButton
                    className={classes.claimButton}
                    onClick={() => {
                      navigate(`/crowdtasks/${task.task_id}`);
                    }}
                  >
                    Claim Task
                  </GeneralButton>
                </div>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        !error && (
          <div className={classes.noTasks}>
            <p style={{ fontSize: "1.5rem" }}>
              No tasks available at the moment.
            </p>
            <p>
              Please check back later to see if someone has created a task for
              the crowd.
            </p>
          </div>
        )
      )}
    </>
  );
}

export default CrowdTasksGrid;