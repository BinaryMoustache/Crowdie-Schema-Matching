import { useState } from "react";
import Modal from "../UI/Modal";
import { getAuthToken } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";

import classes from "./CreateNewTaskForm.module.css";
import InputText from "../UI/InputText";
import DropZone from "../UI/DropZone";
import GeneralButton from "../UI/GeneralButton";

function CreateNewTaskForm({ open = false, onClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [threshold, setThreshold] = useState("");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles) => {
    const validFiles = newFiles.filter((file) => file.type === "text/csv");
    if (validFiles.length) {
      setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    } else {
      alert("Please upload only CSV files.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getAuthToken();
    if (!token) {
      alert("You need to be logged in to create a task.");
      return;
    }

    const taskData = new FormData();
    taskData.append("name", name);
    taskData.append("description", description);
    taskData.append("threshold", threshold);

    files.forEach((file) => {
      taskData.append("files", file);
    });

    try {
      const response = await fetch("http://localhost:8000/tasks/create/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: taskData,
      });

      if (response.ok) {
        const data = await response.json();
        window.location.reload();
        console.log("Task created:", data);
      } else {
        const errorData = await response.json();
        console.error("Error creating task:", errorData);
        alert("Failed to create task. Please try again.");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const isFormValid = () => {
    return (
      name.trim() !== "" &&
      description.trim() !== "" &&
      threshold !== "" &&
      files.length > 0
    );
  };

  return (
    <Modal open={open}>
      <div className={classes.container}>
        <div className={classes.header}>
          <h2>Create a New Task for Schema Matching</h2>
          <IoMdClose onClick={onClose} />
        </div>

        <form className={classes.form_container} onSubmit={handleSubmit}>
          <div className={classes.controls}>
            <div className={classes.left_controls}>
              <div>
                <InputText
                  label="task name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  required={true}
                  placeholder="Enter a name for the task"
                />
                <p>Enter a concise name for the task to easily identify it.</p>
              </div>
              <div>
                <InputText
                  id="description"
                  label="task description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  required={true}
                  placeholder="Enter the task description"
                />
                <p>
                  Provide a detailed description of the task, including its
                  objectives and the specific schema matching requirements.
                </p>
              </div>
              <div>
                <InputText
                  id="sim-thres"
                  type="number"
                  label="Similarity Threshold"
                  value={threshold}
                  onChange={(e) => {
                    setThreshold(e.target.value);
                  }}
                  min="0"
                  max="1"
                  step="0.1"
                  placeholder="Set the similarity threshold"
                />
                <p>
                  Set the similarity threshold for matching schema elements.
                  Only pairs with a similarity score above this threshold will
                  be selected for further analysis using cosine similarity.{" "}
                </p>
              </div>
            </div>
            <div className={classes.right_controls}>
              <DropZone
                files={files}
                onChange={handleFileChange}
                onDrop={handleDrop}
              />
            </div>
          </div>
          {error && <p className="error">{error}</p>}
          <GeneralButton
            type="submit"
            className={classes.createButton}
            disabled={!isFormValid()}
          >
            Create Task
          </GeneralButton>
        </form>
      </div>
    </Modal>
  );
}

export default CreateNewTaskForm;
