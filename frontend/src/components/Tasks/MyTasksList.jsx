import { useState } from "react";
import { getAuthToken } from "../../utils/auth";
import { env } from "../../utils/env";
import { GoPlus, GoTrash, GoChevronUp, GoChevronDown } from "react-icons/go";

import Card from "../UI/Card";
import UtilButton from "../UI/UtilButton";
import GeneralButton from "../UI/GeneralButton";
import classes from "./MyTasksList.module.css";

function MyTasksList(props) {
  const tasks = props.tasks || [];
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [error, setError] = useState(null);
  const [disabledButton, setDisabledButton] = useState(true);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const statusColors = {
    pending: "#FFA500",
    active: "#28a745",
    completed: "#007bff",
  };

  const checkboxChangeHandler = (taskId) => {
    setSelectedTasks((prevSelected) => {
      const newSelectedTasks = prevSelected.includes(taskId)
        ? prevSelected.filter((id) => id !== taskId)
        : [...prevSelected, taskId];

      setDisabledButton(newSelectedTasks.length === 0);
      return newSelectedTasks;
    });
  };

  const deleteTasksHandler = async () => {
    const token = getAuthToken();
    if (!token) {
      alert("You need to be logged in to delete tasks.");
      return;
    }

    try {
      await Promise.all(
        selectedTasks.map(async (taskId) => {
          const response = await fetch(
            `${env.BACKEND_URL}/tasks/delete/${taskId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to delete task: " + taskId);
          }
        })
      );

      props.setTasks((prevTasks) =>
        prevTasks.filter((task) => !selectedTasks.includes(task.id))
      );
      setSelectedTasks([]);
      setDisabledButton(true);
    } catch (error) {
      setError("An error occurred while deleting tasks.");
    }
  };

  const toggleExpandHandler = (taskId) => {
    setExpandedTaskId((prevTaskId) => (prevTaskId === taskId ? null : taskId));
  };

  return (
    <Card className={classes.container}>
      <div className={classes.actions}>
        <UtilButton icon={GoPlus} onClick={props.onCreate} disabled={false}>
          Create
        </UtilButton>
        <UtilButton
          icon={GoTrash}
          onClick={deleteTasksHandler}
          disabled={disabledButton}
          size={16}
        >
          Delete
        </UtilButton>
      </div>
      <hr />
      <div className={classes.content}>
        {error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <ul className={classes.taskList}>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <li key={task.id} className={classes.taskItem}>
                  <div className={classes.taskHeader}>
                    <div className={classes.taskName}>
                      <input
                        id={`task-${task.id}`}
                        type="checkbox"
                        checked={selectedTasks.includes(task.id)}
                        onChange={() => checkboxChangeHandler(task.id)}
                        className={classes.checkbox}
                      />
                      <p>
                        <strong>Task Name:</strong> {task.name}
                      </p>
                    </div>
                    <div className={classes.taskStatus}>
                      <p>
                        <strong>Status:</strong>{" "}
                      </p>
                      <span
                        className={classes.status}
                        style={{ color: statusColors[task.status] }}
                      >
                        {" "}
                        {task.status || "Unknown"}
                      </span>

                      <span
                        className={classes.expandIcon}
                        onClick={() => toggleExpandHandler(task.id)}
                      >
                        {expandedTaskId === task.id ? (
                          <GoChevronUp />
                        ) : (
                          <GoChevronDown />
                        )}
                      </span>
                    </div>
                  </div>
                  {expandedTaskId === task.id && (
                    <div className={classes.taskDetails}>
                      <div>
                        <p>
                          <strong>Description:</strong>{" "}
                          {task.description || "No description available"}
                        </p>
                        <p>
                          <strong>Number of Tables:</strong>{" "}
                          {task.num_of_tables || "N/A"}
                        </p>
                        <p>
                          <strong>Similarity Threshold:</strong>{" "}
                          {task.threshold || 0.0}
                        </p>
                        <p>
                          <strong>Number of Microtasks:</strong>{" "}
                          {task.num_microtasks || "N/A"}
                        </p>
                        <p>
                          <strong>Date Created:</strong>{" "}
                          {task.created_at.split("T")[0] || "N/A"}
                        </p>
                      </div>
                      {task.status === "completed" && (
                        <GeneralButton>Download</GeneralButton>
                      )}
                    </div>
                  )}
                </li>
              ))
            ) : (
              <p className={classes.message}>
                No tasks found! Click ‘Create’ to add a new task and upload your
                tables for schema matching.
              </p>
            )}
          </ul>
        )}
      </div>
    </Card>
  );
}

export default MyTasksList;
