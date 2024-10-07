import React from "react";
import { FaFileCsv } from "react-icons/fa";
import classes from "./DropZone.module.css";

function DropZone(props) {
  const files = props.files;

  return (
    <div>
      <label htmlFor="file-input" className={classes.uploadLabel}>
        Drag and drop or click to upload CSV files
      </label>
      <div
        className={classes.dropZone}
        onDragOver={(e) => e.preventDefault()}
        onDrop={props.onDrop}
        onClick={() => document.getElementById("file-input").click()}
      >
        {files.length === 0 ? (
          <FaFileCsv size={40} color="#34495E" className={classes.icon} />
        ) : (
          <ul className={classes.fileList}>
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        )}

        <input
          id="file-input"
          type="file"
          multiple
          onChange={props.onChange}
          style={{ display: "none" }}
          accept=".csv"
          required
        />
      </div>
    </div>
  );
}

export default DropZone;