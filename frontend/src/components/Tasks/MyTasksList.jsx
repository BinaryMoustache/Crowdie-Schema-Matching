import { useState, useEffect } from "react";
import Card from "../UI/Card";
import UtilButton from "../UI/UtilButton";
import { GoPlus, GoTrash, GoChevronUp, GoChevronDown } from "react-icons/go";
import classes from "./MyTasksList.module.css";
import { getAuthToken } from "../../utils/auth";

function MyTasksList(props) {
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [error, setError] = useState(null);
  const [disabledButton, setDisabledButton] = useState(true); 
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const statusColors = {
    pending: "#FFA500", 
    active: "#28a745", 
    completed: "#007bff", 
  };


  useEffect(() => {
    const fetchTasks = async () => {
      const token = getAuthToken();
      console.log("Auth Token:", token); 
      if (!token) {
        alert("You need to be logged in to view tasks.");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/tasks/mytasks/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTasks(data);
          console.log(data)
        } else {
          const errorData = await response.json();
          setError(errorData.detail || "Failed to fetch tasks.");
        }
      } catch (error) {
        console.error("Network error:", error);
        setError("An error occurred while fetching tasks.");
      }
    };

    fetchTasks();
  }, []);

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
            `http://localhost:8000/tasks/delete/${taskId}`,
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

      setTasks((prevTasks) =>
        prevTasks.filter((task) => !selectedTasks.includes(task.id))
      );
      setSelectedTasks([]);
      setDisabledButton(true); 
    } catch (error) {
      console.error("Failed to delete tasks", error);
      setError("An error occurred while deleting tasks.");
    }
  };

  const toggleExpandHandler = (taskId) => {
    setExpandedTaskId(
      (prevTaskId) => (prevTaskId === taskId ? null : taskId) 
    );
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
      {error ?  <p style={{ color: "red" }}>{error}</p> :
    
        <ul className={classes.taskList}>
          {tasks.length > 0 ?
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
                  <p >
                    <strong>Status:</strong><span style={{"color": statusColors[task.status]}}> {task.status || "Unknown"}</span>
                  </p>
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
                    <p>
                      <strong>Description:</strong>{" "}
                      {task.description || "No description available"}
                    </p>
                    <p>
                      <strong>Table Names:</strong>{" "}
                      {task.table_names || "N/A"}
                    </p>
                    <p>
                      <strong>Similarity Threshold:</strong>{" "}
                      {task.threshold || "N/A"}
                    </p>
                      <p>
                      <strong>Number of Microtasks:</strong>{" "}
                      {task.num_microtasks || "N/A"}
                    </p>
                  </div>
                )}
              </li>
            )): <p className={classes.message}>No tasks found! Click ‘Create’ to add a new task and upload your tables for schema matching.</p>}
            </ul>}
      </div>
    </Card>
  );
}

export default MyTasksList;
