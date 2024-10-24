import { useReducer } from "react";
import { GoSidebarCollapse } from "react-icons/go";
import { getAuthToken } from "../../utils/auth";
import { env } from "../../utils/env";

import InputText from "../UI/InputText";
import InputSelect from "../UI/InputSelect";
import GeneralButton from "../UI/GeneralButton";
import Slider from "../UI/Slider";
import DropZone from "../UI/DropZone";
import FormField from "./FormField";
import classes from "./CreateTaskForm.module.css";

const initialState = {
  name: "",
  description: "",
  threshold: "",
  numAnswers: 3,
  experience: "",
  tables: [],
  fileUploadError: "",
  nameError: null,
  hasInteracted: false,
  visibleIndex: 0,
  successMessage: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "ADD_FILES":
      return {
        ...state,
        tables: [...state.tables, ...action.files],
        fileUploadError: "",
      };
    case "SET_UPLOAD_ERROR":
      return { ...state, fileUploadError: action.error };
    case "SET_INTERACTED":
      return { ...state, hasInteracted: true };
    case "NEXT_FIELD":
      return { ...state, visibleIndex: Math.min(state.visibleIndex + 1, 5) };
    case "TOGGLE_FIELD":
      return {
        ...state,
        visibleIndex: state.visibleIndex === action.index ? -1 : action.index,
      };
    case "SET_NAME_ERROR":
      return { ...state, nameError: action.error };
    case "SET_SUCCESS_MESSAGE":
      return { ...state, successMessage: action.message };
    case "RESET_FORM":
      return initialState;

    default:
      return state;
  }
};

function CreateTaskForm({ isVisible, onClose }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    name,
    description,
    threshold,
    numAnswers,
    experience,
    tables,
    fileUploadError,
    nameError,
    hasInteracted,
    visibleIndex,
  } = state;

  const resetForm = () => {
    dispatch({ type: "RESET_FORM" });
  };
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
    const existingFileNames = state.tables.map((file) => file.name);
    const validFiles = [];
    let errorMessage = "";

    newFiles.forEach((file) => {
      if (file.type !== "text/csv") {
        e;
        errorMessage = `Invalid file type "${file.name}". Only CSV files are allowed.`;
      } else if (existingFileNames.includes(file.name)) {
        errorMessage = `File "${file.name}" already exists.`;
      } else {
        validFiles.push(file);
      }
    });
    if (!errorMessage && validFiles.length > 0) {
      dispatch({ type: "ADD_FILES", files: validFiles });
    } else if (errorMessage) {
      dispatch({ type: "SET_UPLOAD_ERROR", error: errorMessage });
    }
  };
  const fields = [
    {
      label: "Task Name",
      description: (
        <>
          {nameError ? (
            <p style={{ color: "red" }}>{nameError}</p>
          ) : (
            <p>
              Enter a unique name for your task. This will help you identify it
              later.
            </p>
          )}
        </>
      ),
      value: name,
      component: (
        <InputText
          id="name"
          value={name}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "name",
              value: e.target.value,
            })
          }
          required={true}
          placeholder="Enter a name for the task"
        />
      ),
    },
    {
      label: "Task Description",
      description:
        "Provide a detailed description of the task. Include key objectives and any specific instructions",
      value: description,
      component: (
        <InputText
          id="description"
          value={description}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "description",
              value: e.target.value,
            })
          }
          required={true}
          placeholder="Enter the task description"
        />
      ),
    },
    {
      label: "Similarity Threshold",
      description:
        "Set a value between 0 and 1 to define the similarity threshold for matching tasks. A higher value means stricter matching.",
      value: threshold,
      component: (
        <InputText
          className={classes.simThreshInput}
          id="sim-thres"
          type="number"
          value={threshold}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "threshold",
              value: e.target.value,
            })
          }
          min="0"
          max="1"
          step="0.1"
          placeholder="0.0"
        />
      ),
    },
    {
      label: "Number of Responses for Microtasks",
      description:
        "Specify how many responses you require for each microtask to ensure adequate coverage and accuracy.",
      value: hasInteracted ? numAnswers : "",
      component: (
        <Slider
          value={numAnswers}
          onChange={(val) => {
            dispatch({ type: "SET_FIELD", field: "numAnswers", value: val });
            dispatch({ type: "SET_INTERACTED" });
          }}
        />
      ),
    },
    {
      label: "Select Worker Experience Level",
      description:
        "Choose whether you prefer experienced workers for this task. Experienced workers may provide higher quality responses.",
      value: experience,
      component: (
        <InputSelect
          id="experience"
          value={experience}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "experience",
              value: e.target.value,
            })
          }
          required={true}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
      ),
    },
    {
      label: "Upload Your Data Tables",
      description: (
        <>
          {fileUploadError ? (
            <p style={{ color: "red" }}>{fileUploadError}</p>
          ) : (
            <p>
              Please upload at least two CSV files that contain relevant data
              for your task. These files will be used to generate tasks and
              microtasks for schema matching
            </p>
          )}
        </>
      ),
      value: hasInteracted ? `${tables.length} file(s) uploaded` : "",
      component: (
        <div className={classes.drop}>
          <DropZone
            files={tables}
            onChange={handleFileChange}
            onDrop={handleDrop}
          />
        </div>
      ),
    },
  ];

  const createTaskHandler = async () => {
    const token = getAuthToken();
    if (!token) {
      alert("You need to be logged in to create a task.");
      return;
    }

    const taskData = {
      name,
      description,
      threshold,
      numAnswers,
      experience,
      tables,
    };

    const taskFormData = new FormData();
    taskFormData.append("name", taskData.name);
    taskFormData.append("description", taskData.description);
    taskFormData.append("threshold", taskData.threshold);
    taskFormData.append("required_answers", taskData.numAnswers);
    taskFormData.append("is_experience_required", taskData.experience);

    if (tables && tables.length > 0) {
      tables.forEach((table) => {
        taskFormData.append("files", table);
      });
    }
    console.log(taskFormData)
    
    try {
      const response = await fetch(`${env.BACKEND_URL}/tasks/create/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: taskFormData,
      });

      if (response.ok) {
        const data = await response.json();
        resetForm();
        dispatch({
          type: "SET_SUCCESS_MESSAGE",
          message: "Task created successfully!",
        });
        setTimeout(() => {
          resetForm();
          window.location.reload();
        }, 4000);
      } else {
        const errorData = await response.json();
        if (
          errorData.detail &&
          errorData.detail.includes("Task with this name already exists.")
        ) {
          dispatch({
            type: "SET_NAME_ERROR",
            error: "Task with this name already exists.",
          });
          dispatch({ type: "TOGGLE_FIELD", index: 0 });
        }
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className={`${classes.container} ${isVisible ? classes.active : ""}`}>
      <div className={classes.sidebarHeader}>
        <h2>Create a New Task</h2>
        <span onClick={onClose}>
          <GoSidebarCollapse size={20} />
        </span>
      </div>

      <div className={classes.formContainer}>
        <ul className={classes.fieldList}>
          {fields.map((field, index) => (
            <FormField
              key={index}
              field={field}
              index={index}
              isActive={visibleIndex === index}
              onToggle={(index) => {
                if (index === 0 || (index > 0 && fields[index - 1]?.value)) {
                  dispatch({ type: "TOGGLE_FIELD", index });
                }
              }}
              onContinue={() => dispatch({ type: "NEXT_FIELD" })}
            />
          ))}
        </ul>

        <div className={classes.createButton}>
          {state.successMessage && (
            <p className={classes.successMessage}>{state.successMessage}</p>
          )}
          <GeneralButton
            type="button"
            onClick={createTaskHandler}
            disabled={
              !name ||
              !description ||
              !threshold ||
              !numAnswers ||
              !experience ||
              tables.length < 2
            }
          >
            Create Task
          </GeneralButton>
        </div>
      </div>
    </div>
  );
}

export default CreateTaskForm;
