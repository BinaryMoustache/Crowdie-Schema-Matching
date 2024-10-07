import { useState } from "react";
import CreateNewTaskForm from "../components/Tasks/CreateNewTaskForm";
import MyTasksList from "../components/Tasks/MyTasksList";
import classes from "./MyTasksPage.module.css";

function MyTasksPage() {
  const [showModal, setShowModal] = useState(false);

  const showModalHandler = () => {
    setShowModal(true);
  };
  const hideModalHandler = () => {
    setShowModal(false);
  };

  return (
    <div className={classes.container}>
      <h3 className={classes.header}>Create and Monitor Your Tasks</h3>
      <MyTasksList onCreate={showModalHandler} />
      <CreateNewTaskForm open={showModal} onClose={hideModalHandler} />
    </div>
  );
}

export default MyTasksPage;
