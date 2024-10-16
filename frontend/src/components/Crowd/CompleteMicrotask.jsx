import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAuthToken } from "../../utils/auth";

import MicrotaskDetails from "./MicrotaskDetails";
import classes from "./CompleteMicrotask.module.css";

function CompleteMicrotask() {
  const { taskId } = useParams();
  const [microtask, setMicrotask] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    fetchMicrotask();
  }, [taskId]);

  const fetchMicrotask = async () => {
    setLoading(true);
    setError(null);
    const token = getAuthToken();

    try {
      console.log(`Fetching microtask for task ID: ${taskId}`);
      const response = await fetch(
        `http://localhost:8000/tasks/microtask/${taskId}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to load microtask: ${response.status} ${errorText}`
        );
      }

      const data = await response.json();
      setMicrotask(data);
      setStartTime(Date.now());
    } catch (err) {
      setError(err.message || "Failed to load microtask.");
    } finally {
      setLoading(false);
    }
  };

  const responseSubmitHandler = async (responseValue) => {
    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000;
    console.log(`Time taken: ${timeTaken} seconds`);
    console.log(responseValue);
    setError(null);
    const token = getAuthToken();

    try {
      console.log(`Submitting response for task ID: ${taskId}`);
      const response = await fetch(
        `http://localhost:8000/tasks/microtask_answer/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            response: responseValue,
            microtask_id: microtask.id,
            time_taken: timeTaken,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to submit response: ${response.status} ${errorText}`
        );
      }
      fetchMicrotask();
    } catch (err) {
      setError(err.message || "Failed to submit response.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={classes.container}>
      <div className={classes.infoContainer}>
        <h2 className={classes.header}>Microtask Assignment</h2>
        <p>
          You're tasked with completing small, focused microtasks based on the
          provided data. Please follow the steps below to ensure accuracy and
          efficiency. Take your time to review before submitting.
        </p>
        <ul className={classes.instructionsList}>
          <li>Examine the microtask details thoroughly before deciding.</li>
          <li>
            Submit your response by choosing "Yes," "No," or "Skip" based on the
            information given.
          </li>
          <li>
            If there are no available microtasks, a confirmation message will
            let you know you've completed all microtasks.
          </li>
          <li>
            Feel free to leave and return at any time to continue your progress.
          </li>
        </ul>
      </div>
      <div className={classes.taskContainer}>
        {microtask ? (
          <MicrotaskDetails
            data={microtask}
            onYes={() => responseSubmitHandler("yes")}
            onNo={() => responseSubmitHandler("no")}
            onSkip={() => responseSubmitHandler("n/a")}
          />
        ) : (
          <p className={classes.successMessage}>
            Congratulations! You have completed all available microtasks.
          </p>
        )}
      </div>
    </div>
  );
}

export default CompleteMicrotask;
