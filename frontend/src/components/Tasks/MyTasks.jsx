import { useState, useEffect } from "react";
import { getAuthToken } from "../../utils/auth";
import { env } from "../../utils/env";

import MyTasksList from "./MyTasksList";
import CreateTaskForm from "./CreateTaskForm";
import classes from "./MyTasks.module.css";

function MyTasks() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [errorData, setErrorData] = useState(null);

  const fetchTasksHandler = async () => {
    const token = getAuthToken();
    if (!token) {
      alert("You need to be logged in to view tasks.");
      return;
    }

    try {
      const response = await fetch(`${env.BACKEND_URL}/tasks/tasks/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        const errorData = await response.json();
        setErrorData(errorData.detail || "Failed to fetch tasks.");
      }
    } catch (error) {
      setErrorData("An error occurred while fetching tasks.");
    }
  };

  useEffect(() => {
    fetchTasksHandler();
  }, []);

  const toggleSidebarHandler = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  return (
    <div className={classes.container}>
      <h2 className={classes.header}>Create and Monitor Your Tasks</h2>
      {errorData ? (
        <p className={classes.errorMessage}>{errorData} </p>
      ) : (
        <>
          <MyTasksList
            onCreate={toggleSidebarHandler}
            tasks={tasks}
            setTasks={setTasks}
          />

          <CreateTaskForm
            isVisible={isSidebarVisible}
            onClose={toggleSidebarHandler}
          />
        </>
      )}
    </div>
  );
}

export default MyTasks;
